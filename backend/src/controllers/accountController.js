import { Account, User } from '../models/index.js';
import { getCache, setCache, delCache } from '../config/redis.js';
import logger from '../config/logger.js';

// Helper to generate a unique 10-digit account number
const generateAccountNumber = async () => {
  let isUnique = false;
  let accountNumber = '';
  
  while (!isUnique) {
    // Generate a random 10-digit number
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const count = await Account.count({ where: { account_number: accountNumber } });
    if (count === 0) {
      isUnique = true;
    }
  }
  
  return accountNumber;
};

export const createAccount = async (req, res, next) => {
  try {
    const { account_type, initial_deposit } = req.body;
    const userId = req.user.id;

    const accountNumber = await generateAccountNumber();
    const account = await Account.create({
      user_id: userId,
      account_type,
      account_number: accountNumber,
      balance: initial_deposit || 0.0,
      status: 'active',
    });

    logger.info(`Account created successfully: ${account.account_number} for user ${userId}`);

    // Invalidate client's accounts list cache
    await delCache(`accounts:${userId}`);

    res.status(201).json({
      message: 'Cuenta creada exitosamente.',
      account,
    });
  } catch (error) {
    logger.error('Error creating account:', error);
    next(error);
  }
};

export const getMyAccounts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cacheKey = `accounts:${userId}`;

    // Try cache first
    const cachedAccounts = await getCache(cacheKey);
    if (cachedAccounts) {
      logger.info(`Serving accounts from cache for user: ${userId}`);
      return res.json({ accounts: cachedAccounts, source: 'cache' });
    }

    // Database fallback
    const accounts = await Account.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    // Save to cache (TTL: 10 minutes)
    await setCache(cacheKey, accounts, 600);

    res.json({ accounts, source: 'db' });
  } catch (error) {
    logger.error('Error fetching client accounts:', error);
    next(error);
  }
};

export const getAllAccounts = async (req, res, next) => {
  try {
    const { userId, accountType, status, accountNumber } = req.query;
    const filter = {};

    if (userId) filter.user_id = userId;
    if (accountType) filter.account_type = accountType;
    if (status) filter.status = status;
    if (accountNumber) filter.account_number = accountNumber;

    const accounts = await Account.findAll({
      where: filter,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'first_name', 'last_name', 'dni', 'phone', 'role'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({ accounts });
  } catch (error) {
    logger.error('Error fetching all accounts for admin:', error);
    next(error);
  }
};

export const blockAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active or blocked

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada.' });
    }

    account.status = status;
    await account.save();

    logger.info(`Account ${account.account_number} status updated to ${status} by admin.`);

    // Invalidate client's accounts list cache
    await delCache(`accounts:${account.user_id}`);

    res.json({
      message: `Cuenta ${status === 'blocked' ? 'bloqueada' : 'desbloqueada'} exitosamente.`,
      account,
    });
  } catch (error) {
    logger.error('Error updating account status:', error);
    next(error);
  }
};

export const getAccountBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);

    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada.' });
    }

    // Authorization: Client can only view their own account balance, unless they are admin
    const isAdmin = ['admin_general', 'admin_accounts', 'admin_cuentas'].includes(req.user.role);
    if (account.user_id !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: 'No autorizado para ver el saldo de esta cuenta.' });
    }

    res.json({
      account_number: account.account_number,
      account_type: account.account_type,
      balance: account.balance,
      status: account.status,
    });
  } catch (error) {
    logger.error('Error fetching account balance:', error);
    next(error);
  }
};
