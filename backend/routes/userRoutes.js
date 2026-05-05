const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Search user by email (member add layi)
router.get('/', protect, asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) return res.json([]);
  const users = await User.find({
    email: { $regex: email, $options: 'i' }
  }).select('name email _id').limit(5);
  res.json(users);
}));

module.exports = router;