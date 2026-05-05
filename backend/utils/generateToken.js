const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {string} id - User MongoDB _id
 * @param {string} expiresIn - default 7 days
 */
const generateToken = (id, expiresIn = '7d') => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not set in .env');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;