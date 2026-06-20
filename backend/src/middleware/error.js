import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled server error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
