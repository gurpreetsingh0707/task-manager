const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

/**
 * POST /api/auth/signup
 * Register new user
 */
exports.signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Name, email and password are required');
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    // Check duplicate
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    // Create user (password hashed by model pre-save hook)
    const user = await User.create({ name, email, password });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
});

/**
 * POST /api/auth/login
 * Login, returns JWT
 */
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
});

/**
 * GET /api/auth/me
 * Get current logged-in user
 */
exports.getMe = asyncHandler(async (req, res) => {
    // req.user set by authMiddleware protect
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

/**
 * PUT /api/auth/update-profile
 * Update name or email
 */
exports.updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    const { name, email } = req.body;

    if (email && email !== user.email) {
        const emailTaken = await User.findOne({ email });
        if (emailTaken) {
            res.status(400);
            throw new Error('Email already in use');
        }
        user.email = email;
    }

    user.name = name || user.name;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
});

/**
 * PUT /api/auth/change-password
 * Change password (need current password)
 */
exports.changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Both current and new password required');
    }
    if (newPassword.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
    }

    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    res.json({ message: 'Password changed successfully' });
});