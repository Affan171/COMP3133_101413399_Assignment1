const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req) => {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error('No token provided');
    }

    try {
        // Verify token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = auth;
