// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const Build = require('../models/build');
const requireLogin = require('../middleware/auth');

const router = express.Router();

// every route below needs the user to be logged in
router.use(requireLogin);

// ===== HELPER =====
// checks if an id looks like a real MongoDB id
function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// ===== GET ALL MY BUILDS =====
// GET /api/builds
router.get('/', async (req, res) => {
    try {
        // only find builds that belong to the logged in user
        const builds = await Build.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(builds);
    } catch (err) {
        res.status(500).json({ message: 'Could not load builds' });
    }
});

// ===== GET ONE OF MY BUILDS =====
// GET /api/builds/:id
router.get('/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid build id' });
    }

    try {
        const build = await Build.findOne({ _id: req.params.id, user: req.user.id });
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
        const newBuild = await Build.create({
            user: req.user.id,   // attach the build to whoever is logged in
            name,
            parts,
            totalPrice
        });
        res.status(201).json(newBuild);
    } catch (err) {
        res.status(500).json({ message: 'Could not save build' });
    }
});

// ===== UPDATE ONE OF MY BUILDS =====
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
        // only update it if it belongs to this user
        const updated = await Build.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
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

// ===== DELETE ONE OF MY BUILDS =====
// DELETE /api/builds/:id
router.delete('/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid build id' });
    }

    try {
        // only delete it if it belongs to this user
        const deleted = await Build.findOneAndDelete({ _id: req.params.id, user: req.user.id });
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