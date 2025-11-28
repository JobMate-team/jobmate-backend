import Redis from "ioredis";

export const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost", //AWS EC2에 Redis 직접 설치 시 EC2 private IP로 env설정
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: (times) => Math.min(times * 50, 2000), //redis 서버 down되지 않도록 자동 재연결(최대 2초)
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err.message));