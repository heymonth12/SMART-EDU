import Redis from 'ioredis';

const redisClient = new Redis({
  host: '127.0.0.1', // Redis server IP
  port: 6379,        // Default Redis port
});

export default redisClient;
