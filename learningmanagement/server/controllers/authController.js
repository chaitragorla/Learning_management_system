// server/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc  Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Only allow student or instructor roles on registration
  const allowedRoles = ['student', 'instructor'];
  const userRole = allowedRoles.includes(role) ? role : 'student';

  const user = await User.create({ name, email, password, role: userRole });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

/**
 * @desc  Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
    },
  });
};

/**
 * @desc  Get current authenticated user
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    notifications: user.notifications,
    createdAt: user.createdAt,
  });
};

/**
 * @desc  Update current user profile
 * @route PUT /api/auth/me
 * @access Private
 */
const updateProfile = async (req, res) => {
  const { name, bio } = req.body;
  const update = {};
  if (name) update.name = name;
  if (bio !== undefined) update.bio = bio;

  // Handle avatar upload if file was sent
  if (req.file) {
    update.avatar = req.file.path; // Cloudinary URL
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
  });
};

/**
 * @desc  Mark notifications as read
 * @route PUT /api/auth/notifications/read
 * @access Private
 */
const markNotificationsRead = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { 'notifications.$[].read': true },
  });
  res.json({ message: 'Notifications marked as read' });
};

module.exports = { register, login, getMe, updateProfile, markNotificationsRead };
