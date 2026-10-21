const { createClient } = require("redis");

const redisHost = process.env.REDIS_HOST || "redis";
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

redisClient.on("connect", () => {
  console.log("✅ Connecté au serveur Redis avec succès");
});

redisClient.on("error", (err) => {
  console.error("❌ Erreur Redis :", err.message);
});

// Connexion au démarrage
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Impossible de se connecter à Redis :", error.message);
  }
})();

module.exports = redisClient;