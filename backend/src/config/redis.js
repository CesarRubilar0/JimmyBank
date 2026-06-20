import { createClient } from 'redis';
import logger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;
let isRedisConnected = false;

const initRedis = async () => {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = createClient({
    url,
    socket: {
      reconnectStrategy: (retries) => {
        // Stop reconnecting after 3 failed attempts to avoid log spam if Redis is offline
        if (retries > 2) {
          logger.warn('Redis connection retired. Caching disabled.');
          return false; // stops reconnection
        }
        return 1000; // retry after 1 second
      }
    }
  });

  redisClient.on('error', (err) => {
    // Only log warning instead of full error stack trace for connection issues
    if (err.message.includes('ECONNREFUSED')) {
      logger.debug('Redis offline (ECONNREFUSED).');
    } else {
      logger.error('Redis Client Error:', err);
    }
    isRedisConnected = false;
  });

  redisClient.on('connect', () => {
    logger.info('Redis client connecting...');
  });

  redisClient.on('ready', () => {
    logger.info('Redis client connected and ready.');
    isRedisConnected = true;
  });

  try {
    await redisClient.connect();
  } catch (error) {
    logger.warn('Failed to connect to Redis. Running without caching capabilities.');
    isRedisConnected = false;
  }
};

// Caching helper functions
export const getCache = async (key) => {
  if (!isRedisConnected || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 600) => {
  if (!isRedisConnected || !redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
  }
};

export const delCache = async (key) => {
  if (!isRedisConnected || !redisClient) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Error deleting cache for key ${key}:`, error);
  }
};

export { initRedis, redisClient, isRedisConnected };
export default initRedis;
