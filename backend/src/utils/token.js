import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret_key_change_me_in_production';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_change_me_in_production';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};
