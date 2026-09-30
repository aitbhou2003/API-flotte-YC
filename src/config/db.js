const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // process.env.MONGO_URI récupère l'URL depuis le fichier .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Base de données MongoDB connectée avec succès');
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB:', error.message);
        // Si la base ne répond pas, on arrête complètement le serveur
        process.exit(1);
    }
};

module.exports = connectDB;