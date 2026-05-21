import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, transformUser } from '../utils/helpers.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, username, email, password, avatar } = req.body;

    // Validation
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ 
        message: userExists.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with initials-based avatar if none provided
    const initials = fullName.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2);
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=ffffff&size=150&bold=true`;
    
    const user = await User.create({
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: avatar || defaultAvatar
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          badge: user.badge,
          bio: user.bio,
          verified: user.verified,
          unreadMessages: user.unreadMessages,
          unreadNotifications: user.unreadNotifications,
          connectionsCount: user.connections ? user.connections.length : 0,
          connections: user.connections || [],
          joinedDate: user.joinedDate
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user by email OR username
    const user = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        badge: user.badge,
        bio: user.bio,
        verified: user.verified,
        unreadMessages: user.unreadMessages,
        unreadNotifications: user.unreadNotifications,
        connectionsCount: user.connections ? user.connections.length : 0,
        connections: user.connections || [],
        joinedDate: user.joinedDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      badge: user.badge,
      bio: user.bio,
      verified: user.verified,
      unreadMessages: user.unreadMessages,
      unreadNotifications: user.unreadNotifications,
      connectionsCount: user.connections.length,
      connections: user.connections,
      joinedDate: user.joinedDate
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
