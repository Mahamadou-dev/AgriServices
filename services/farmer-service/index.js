require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const farmerRoutes = require('./routes/farmers');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/farmerdb';
mongoose.connect(MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/farmers', farmerRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        service: 'farmer-service'
    });
});

// Test route (no auth required)
app.get('/api/farmers/hello', (req, res) => {
    res.json({
        service: 'Farmer Service',
        message: 'Hello World from Farmer Service!',
        status: 'running'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Farmer Service running on port ${PORT}`);
});