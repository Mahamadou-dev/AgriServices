const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const authMiddleware = require('../middleware/auth');

// Internal route for auth-service to create farmer profile (no JWT required)
router.post('/internal/create', async (req, res) => {
    // Check for internal service header
    const internalHeader = req.headers['x-internal-service'];
    if (internalHeader !== 'auth-service') {
        return res.status(403).json({ error: 'Forbidden - Internal route only' });
    }
    
    try {
        const { userId, firstName, lastName, phone, email } = req.body;
        
        // Check if farmer profile already exists for this userId
        const existingFarmer = await Farmer.findOne({ userId });
        if (existingFarmer) {
            return res.status(200).json(existingFarmer); // Return existing profile
        }
        
        const farmer = new Farmer({
            userId,
            firstName,
            lastName,
            phone,
            address: {},
            farms: []
        });
        
        await farmer.save();
        console.log(`✅ Farmer profile created for userId: ${userId}`);
        res.status(201).json(farmer);
    } catch (error) {
        console.error('❌ Error creating farmer profile:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Create a farmer
router.post('/', authMiddleware, async (req, res) => {
    try {
        const farmer = new Farmer(req.body);
        await farmer.save();
        res.status(201).json(farmer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all farmers
router.get('/', authMiddleware, async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.json(farmers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a farmer by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }
        res.json(farmer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a farmer
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }
        res.json(farmer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a farmer
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const farmer = await Farmer.findByIdAndDelete(req.params.id);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }
        res.json({ message: 'Farmer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Internal route for auth-service to delete farmer profile by userId
router.delete('/internal/delete/:userId', async (req, res) => {
    const internalHeader = req.headers['x-internal-service'];
    if (internalHeader !== 'auth-service') {
        return res.status(403).json({ error: 'Forbidden - Internal route only' });
    }
    try {
        const { userId } = req.params;
        const deleted = await Farmer.findOneAndDelete({ userId });
        if (!deleted) {
            return res.status(404).json({ message: 'No farmer profile found' });
        }
        res.json({ message: 'Farmer profile deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
