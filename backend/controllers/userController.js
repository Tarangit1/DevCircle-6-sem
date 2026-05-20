import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { transformPost, transformUser } from '../utils/helpers.js';
import { createNotification } from './notificationController.js';

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's projects (posts with badge 'Building')
    const projects = await Post.find({ authorId: user._id, badge: 'Building' })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const commentCount = await Comment.countDocuments({ postId: project._id });
        return { ...project, commentCount };
      })
    );

    // Get user's recent posts
    const posts = await Post.find({ authorId: user._id })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ postId: post._id });
        return { ...post, commentCount };
      })
    );

    const joinedDate = new Date(user.joinedDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const joinedString = `Joined ${monthNames[joinedDate.getMonth()]} ${joinedDate.getFullYear()}`;

    res.json({
      fullName: user.fullName,
      username: user.username,
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2))}&background=6366f1&color=ffffff&size=150&bold=true`,
      badge: user.badge,
      bio: user.bio,
      verified: user.verified,
      connectionsCount: user.connections.length,
      joinedDate: joinedString,
      projects: projectsWithCounts.map(p => transformPost(p)),
      posts: postsWithCounts.map(p => transformPost(p))
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PATCH /api/users/me
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    console.log('Update profile request body:', req.body);
    console.log('User ID:', req.user._id);
    
    const { fullName, bio, badge, avatar } = req.body;

    const user = await User.findById(req.user._id);
    console.log('Found user:', user ? user.username : 'not found');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (badge !== undefined) user.badge = badge;
    if (avatar) user.avatar = avatar;

    console.log('Saving user with updated data:', {
      fullName: user.fullName,
      bio: user.bio,
      badge: user.badge
    });

    await user.save();
    console.log('User saved successfully');

    const responseData = {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      badge: user.badge,
      bio: user.bio,
      verified: user.verified
    };

    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Connect/disconnect with user
// @route   POST /api/users/:userId/connect
// @access  Private
export const toggleConnection = async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const user = await User.findById(req.user._id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const connectionIndex = user.connections.indexOf(targetUserId);

    if (connectionIndex > -1) {
      // Disconnect
      user.connections.splice(connectionIndex, 1);
      targetUser.connections.splice(targetUser.connections.indexOf(req.user._id), 1);
    } else {
      // Connect
      user.connections.push(targetUserId);
      targetUser.connections.push(req.user._id);
      
      // Send notification to target user
      await createNotification(
        targetUserId,
        req.user._id,
        'connection',
        `${user.fullName} connected with you`
      );
    }

    await user.save();
    await targetUser.save();

    res.json({ 
      connected: connectionIndex === -1,
      connectionsCount: user.connections.length
    });
  } catch (error) {
    console.error('Toggle connection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
