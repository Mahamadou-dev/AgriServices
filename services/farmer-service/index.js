// File: services/farmer-service/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const farmerRoutes = require('./routes/farmers');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/farmers_db';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de santé
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'Farmer Service',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Farmer Service API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            farmers: '/farmers'
        }
    });
});

// Routes
app.use('/farmers', farmerRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// Connexion à MongoDB et démarrage du serveur
const startServer = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Farmer Service running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

startServer();

module.exports = app;
