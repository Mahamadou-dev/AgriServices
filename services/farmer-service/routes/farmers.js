const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const authMiddleware = require('../middleware/auth');

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

module.exports = router;
