import { createClient } from 'redis';
import { logger } from './logger.js';
import { config } from './env.js';

// Redis client for caching and session management
let redisClient: ReturnType<typeof createClient> | null = null;

export async function connectRedis() {
  try {
    // Redis is optional, skip if not configured
    if (!process.env.REDIS_URL) {
      logger.info('⚠️  Redis not configured, skipping connection');
      return null;
    }

    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    redisClient.on('connect', () => logger.info('✅ Redis connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn('Redis connection failed, continuing without cache:', error);
    return null;
  }
}

export async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis disconnected');
  }
}

export function getRedisClient() {
  return redisClient;
}

// Cache helper functions
export async function cacheGet(key: string): Promise<string | null> {
  if (!redisClient) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error('Redis GET error:', error);
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds = 3600): Promise<void> {
  if (!redisClient) return;
  try {
    await redisClient.setEx(key, ttlSeconds, value);
  } catch (error) {
    logger.error('Redis SET error:', error);
  }
}

export async function cacheDel(key: string): Promise<void> {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Redis DEL error:', error);
  }
}
