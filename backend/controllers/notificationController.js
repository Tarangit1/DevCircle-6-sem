import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user._id })
      .populate('senderId', 'fullName username avatar')
      .populate('postId', 'title')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedNotifications = notifications.map(notif => ({
      id: notif._id,
      type: notif.type,
      message: notif.message,
      read: notif.read,
      sender: {
        name: notif.senderId.fullName,
        username: notif.senderId.username,
        avatar: notif.senderId.avatar || `https://i.pravatar.cc/150?u=${notif.senderId._id}`
      },
      postId: notif.postId?._id,
      postTitle: notif.postId?.title,
      bountyAmount: notif.bountyAmount,
      createdAt: notif.createdAt
    }));

    res.json(formattedNotifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();

    // Update user's unread count
    const unreadCount = await Notification.countDocuments({
      recipientId: req.user._id,
      read: false
    });

    await User.findByIdAndUpdate(req.user._id, {
      unreadNotifications: unreadCount
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user._id, read: false },
      { read: true }
    );

    await User.findByIdAndUpdate(req.user._id, {
      unreadNotifications: 0
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to create notification
export const createNotification = async (recipientId, senderId, type, message, additionalData = {}) => {
  try {
    await Notification.create({
      recipientId,
      senderId,
      type,
      message,
      ...additionalData
    });

    // Update recipient's unread count
    const unreadCount = await Notification.countDocuments({
      recipientId,
      read: false
    });

    await User.findByIdAndUpdate(recipientId, {
      unreadNotifications: unreadCount
    });
  } catch (error) {
    console.error('Create notification error:', error);
  }
};
