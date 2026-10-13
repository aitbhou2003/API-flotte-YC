require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { setupSwagger } = require('./src/config/swagger');

const app = express();


app.use(express.json()); 
const userRouter = require('./src/routes/user.router')
const truckRouter = require("./src/routes/truck.router");
const remorqueRouter = require("./src/routes/remorque.router");
const tireRouter = require("./src/routes/tire.router");
const maintenanceRuleRouter = require("./src/routes/maintenanceRule.router");
const maintenanceRouter = require("./src/routes/maintenance.router");
const trajetRouter = require("./src/routes/trajet.router");



app.use(cors()); 
app.use(errorHandler);

setupSwagger(app);

connectDB();
app.use("/api",userRouter.router)
app.use("/api", truckRouter.router);
app.use("/api", remorqueRouter.router);
app.use("/api", tireRouter.router);
app.use("/api", maintenanceRuleRouter.router);
app.use("/api", maintenanceRouter.router);
app.use("/api", trajetRouter.router);



const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API de gestion de flotte opérationnelle !' });
});

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