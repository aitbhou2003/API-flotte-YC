const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redisClient = require("../config/redis");

const createRedisStore = (prefix) => {
  return new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: `rate-limit:${prefix}:`,
  });
};


exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: createRedisStore("auth"),
  message: {
    success: false,
    statusCode: 429,
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
});

exports.standardApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: createRedisStore("standard"),
  message: {
    success: false,
    statusCode: 429,
    message: "Quota Standard API dépassé (max 120 req/min). Veuillez ralentir.",
  },
});


exports.analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  limit: 20,             
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: createRedisStore("analytics"),
  message: {
    success: false,
    statusCode: 429,
    message: "Quota Analytics dépassé (max 20 req/min). Veuillez patienter.",
  },
});