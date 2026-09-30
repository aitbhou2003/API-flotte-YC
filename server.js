// 1. Charger les variables d'environnement en tout premier
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
// 2. Initialiser l'application Express
const app = express();

// 3. Middlewares globaux
app.use(express.json()); // Pour que l'API comprenne le format JSON dans les requêtes
app.use(cors()); // Pour autoriser les requêtes cross-origin

// 4. Connexion à la base de données
connectDB();
const PORT = process.env.PORT || 5000;

// 5. Route de test basique (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API de gestion de flotte opérationnelle !' });
});

// 6. Démarrage du serveur
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Impossible de démarrer le serveur:', error.message);
        process.exit(1);
    }
};

startServer();