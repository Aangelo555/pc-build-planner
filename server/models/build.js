// ===== IMPORTS =====
const mongoose = require('mongoose');

// ===== BUILD SHAPE =====
// what every saved build looks like in the database
const buildSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    parts: {
        cpu: String,
        motherboard: String,
        ram: String,
        gpu: String,
        psu: String
    },
    totalPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// ===== EXPORT =====
module.exports = mongoose.model('Build', buildSchema);