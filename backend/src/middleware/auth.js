import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import logger from '../config/logger.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret_key_change_me_in_production');
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Your account is blocked. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn('Token verification failed:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid access token' });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({ error: 'User context is missing' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

export default { authenticateToken, authorizeRoles };
