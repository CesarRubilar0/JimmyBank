import { User } from '../models/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import logger from '../config/logger.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, dni, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        $or: [
          { email },
          { dni }
        ]
      }
    });

    // Sequelize v6 style or standard Op syntax:
    // Let's use simple check for safety to avoid dialect or operator issues:
    const userByEmail = await User.findOne({ where: { email } });
    if (userByEmail) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const userByDni = await User.findOne({ where: { dni } });
    if (userByDni) {
      return res.status(400).json({ error: 'El DNI/RUT ya está registrado.' });
    }

    // Create user
    const newUser = await User.create({
      email,
      password,
      first_name,
      last_name,
      dni,
      phone,
      address,
      role: 'client', // Default role for registering users
      status: 'active',
    });

    logger.info(`User registered successfully: ${newUser.email} (ID: ${newUser.id})`);

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(201).json({
      message: 'Registro exitoso.',
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        status: newUser.status,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Error during registration:', error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Tu usuario ha sido bloqueado. Por favor, contacta soporte.' });
    }

    logger.info(`User logged in successfully: ${user.email}`);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: 'Login exitoso.',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        status: user.status,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Error during login:', error);
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required.' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token.' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'User is blocked.' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    logger.info(`Tokens rotated for user: ${user.email}`);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error('Error during token refresh:', error);
    next(error);
  }
};
