// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const Build = require('../models/build');

const router = express.Router();

// ===== HELPER =====
// checks if an id looks like a real MongoDB id
function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// ===== GET ALL BUILDS =====
// GET /api/builds
router.get('/', async (req, res) => {
    try {
        const builds = await Build.find().sort({ createdAt: -1 }); // newest first
        res.json(builds);
    } catch (err) {
        res.status(500).json({ message: 'Could not load builds' });
    }
});

// ===== GET ONE BUILD =====
// GET /api/builds/:id
router.get('/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid build id' });
    }

    try {
        const build = await Build.findById(req.params.id);
        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }
        res.json(build);
    } catch (err) {
        res.status(500).json({ message: 'Could not load build' });
    }
});

// ===== SAVE A NEW BUILD =====
// POST /api/builds
router.post('/', async (req, res) => {
    const { name, parts, totalPrice } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Build name is required' });
    }

    try {
        const newBuild = await Build.create({ name, parts, totalPrice });
        res.status(201).json(newBuild);
    } catch (err) {
        res.status(500).json({ message: 'Could not save build' });
    }
});

// ===== UPDATE A BUILD =====
// PUT /api/builds/:id
router.put('/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid build id' });
    }

    const { name, parts, totalPrice } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Build name is required' });
    }

    try {
        const updated = await Build.findByIdAndUpdate(
            req.params.id,
            { name, parts, totalPrice },
            { new: true } // send back the updated version
        );
        if (!updated) {
            return res.status(404).json({ message: 'Build not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Could not update build' });
    }
});

// ===== DELETE A BUILD =====
// DELETE /api/builds/:id
router.delete('/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid build id' });
    }

    try {
        const deleted = await Build.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Build not found' });
        }
        res.json({ message: 'Build deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Could not delete build' });
    }
});

// ===== EXPORT =====
module.exports = router;