// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const buildRoutes = require('./routes/builds');

// ===== APP SETUP =====
const app = express();
app.use(cors());          // lets the React site call this server
app.use(express.json());  // lets the server read JSON sent from React

// ===== ROUTES =====
app.get('/', (req, res) => {
    res.send('PC Build Planner API is running');
});

app.use('/api/builds', buildRoutes);

// ===== CONNECT TO DATABASE, THEN START SERVER =====
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log('Server running on http://localhost:' + PORT);
        });
    })
    .catch((err) => {
        console.log('Could not connect to MongoDB:', err.message);
    });