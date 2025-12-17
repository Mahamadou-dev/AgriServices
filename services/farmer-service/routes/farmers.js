const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const { verifyToken } = require('../middleware/auth');

// GET all farmers
router.get('/', async (req, res) => {
    try {
        const { status, location, page = 1, limit = 10 } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (location) query.location = new RegExp(location, 'i');

        const farmers = await Farmer.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Farmer.countDocuments(query);

        res.json({
            data: farmers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET farmer by ID
router.get('/:id', async (req, res) => {
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

// POST create new farmer (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const farmer = new Farmer(req.body);
        await farmer.save();
        
        res.status(201).json({
            message: 'Farmer created successfully',
            data: farmer
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(400).json({ error: error.message });
    }
});

// PUT update farmer (protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        res.json({
            message: 'Farmer updated successfully',
            data: farmer
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE farmer (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const farmer = await Farmer.findByIdAndDelete(req.params.id);

        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        res.json({
            message: 'Farmer deleted successfully',
            data: farmer
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
