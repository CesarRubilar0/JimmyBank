import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import logger from './config/logger.js';
import { connectDB } from './config/db.js';
import { syncDatabase } from './database/sync.js';
import { initRedis } from './config/redis.js';
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import errorHandler from './middleware/error.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize systems
const bootstrap = async () => {
  try {
    // 1. Connect and Sync Database
    await connectDB();
    await syncDatabase();

    // 2. Initialize Redis (optional/graceful)
    await initRedis();

    // 3. Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));

    // 4. API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/accounts', accountRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date() });
    });

    // 5. Global Error Handler
    app.use(errorHandler);

    // 6. Listen
    app.listen(PORT, () => {
      logger.info(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to bootstrap the backend application:', error);
    process.exit(1);
  }
};

bootstrap();
export default app; // For integration testing
