import Redis from "ioredis";
const redis = new Redis();

export async function getCachedImage(key: string) {
  return await redis.get(key);
}

export async function setCachedImage(key: string, value: string, ttl = 60 * 60 * 24) {
  await redis.set(key, value, "EX", ttl); // Cache for 1 day
}

export async function invalidateCachedImage(baseFileName: string) {
  const sizes = [300, 600, 1200];
  for (const size of sizes) {
    await redis.del(`${baseFileName}-${size}`);
  }
}

export async function closeRedisConnection() {
  await redis.quit();
}