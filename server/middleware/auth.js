// ===== IMPORTS =====
const jwt = require('jsonwebtoken');

// ===== CHECK LOGIN =====
// runs before protected routes and makes sure the user sent a valid token
function requireLogin(req, res, next) {
    // the token comes in a header like: "Authorization: Bearer abc123..."
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Please log in first' });
    }

    const token = header.split(' ')[1];

    try {
        // checks the token is real and not expired
        const data = jwt.verify(token, process.env.JWT_SECRET);

        // saves who the user is so the routes can use it
        req.user = { id: data.id, username: data.username };

        next(); // all good, carry on to the route
    } catch (err) {
        return res.status(401).json({ message: 'Your login has expired, please log in again' });
    }
}

// ===== EXPORT =====
module.exports = requireLogin;