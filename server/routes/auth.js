// ===== IMPORTS =====
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// ===== HELPER =====
// makes a login token that lasts 7 days
function makeToken(user) {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// ===== REGISTER =====
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // basic checks
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (username.trim().length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
        // make sure the username isn't taken
        const existing = await User.findOne({ username: username.toLowerCase().trim() });
        if (existing) {
            return res.status(400).json({ message: 'That username is already taken' });
        }

        // scramble the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password: hashedPassword });

        res.status(201).json({ token: makeToken(newUser), username: newUser.username });
    } catch (err) {
        res.status(500).json({ message: 'Could not create account' });
    }
});

// ===== LOGIN =====
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username: username.toLowerCase().trim() });

        // same message for both cases so people can't guess which usernames exist
        if (!user) {
            return res.status(400).json({ message: 'Wrong username or password' });
        }

        // compare the typed password with the scrambled one in the database
        const correct = await bcrypt.compare(password, user.password);
        if (!correct) {
            return res.status(400).json({ message: 'Wrong username or password' });
        }

        res.json({ token: makeToken(user), username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Could not log in' });
    }
});

// ===== EXPORT =====
module.exports = router;