// ===== IMPORTS =====
const mongoose = require('mongoose');

// ===== USER SHAPE =====
// what every user account looks like in the database
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,    // no two users can have the same username
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true   // this will be the HASHED password, never the real one
    }
}, { timestamps: true });

// ===== EXPORT =====
module.exports = mongoose.model('User', userSchema);