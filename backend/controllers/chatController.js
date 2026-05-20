import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { getTimeAgo } from '../utils/helpers.js';

// @desc    Get all chats for logged-in user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants')
      .sort({ updatedAt: -1 })
      .lean();

    const transformedChats = chats.map(chat => {
      // Get the other participant (not the logged-in user)
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );

      // Count unread messages
      const unreadCount = chat.messages.filter(
        msg => msg.senderId.toString() !== req.user._id.toString() && !msg.isRead
      ).length;

      // Format time
      let timeFormatted;
      const now = new Date();
      const lastMessageTime = new Date(chat.updatedAt);
      const hoursDiff = Math.floor((now - lastMessageTime) / (1000 * 60 * 60));

      if (hoursDiff < 24) {
        // Today - show time
        const hours = lastMessageTime.getHours();
        const minutes = lastMessageTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        timeFormatted = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      } else if (hoursDiff < 48) {
        timeFormatted = 'Yesterday';
      } else {
        const daysDiff = Math.floor(hoursDiff / 24);
        timeFormatted = `${daysDiff}d ago`;
      }

      // Transform messages for the full chat view
      const transformedMessages = chat.messages.map(msg => {
        const sender = chat.participants.find(p => p._id.toString() === msg.senderId.toString());
        return {
          id: msg._id,
          sender: sender?.fullName || 'Unknown',
          text: msg.text,
          time: new Date(msg.time).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          isMe: msg.senderId.toString() === req.user._id.toString()
        };
      });

      return {
        id: chat._id,
        user: {
          id: otherParticipant?._id,
          name: otherParticipant?.fullName || 'Unknown User',
          username: otherParticipant?.username || 'unknown',
          avatar: otherParticipant?.avatar || (otherParticipant?.fullName ? 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2))}&background=6366f1&color=ffffff&size=150&bold=true` : 
            'https://ui-avatars.com/api/?name=U&background=6366f1&color=ffffff&size=150&bold=true'
          ),
          online: false // Can be enhanced with real-time presence
        },
        lastMessage: chat.lastMessage || 'No messages yet',
        time: timeFormatted,
        unread: unreadCount,
        messages: transformedMessages
      };
    });

    res.json(transformedChats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get or create chat with a user
// @route   POST /api/chats
// @access  Private
export const createOrGetChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] }
    }).populate('participants');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [req.user._id, userId],
        messages: [],
        lastMessage: ''
      });
      chat = await Chat.findById(chat._id).populate('participants');
    }

    res.json({ chatId: chat._id });
  } catch (error) {
    console.error('Create/get chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send message in chat
// @route   POST /api/chats/:chatId/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Add message
    const newMessage = {
      senderId: req.user._id,
      text,
      time: new Date(),
      isRead: false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = text.length > 50 ? text.substring(0, 50) + '...' : text;
    chat.updatedAt = new Date();

    await chat.save();

    // Update unread count for the other user
    const otherUserId = chat.participants.find(
      id => id.toString() !== req.user._id.toString()
    );
    
    if (otherUserId) {
      await User.findByIdAndUpdate(otherUserId, {
        $inc: { unreadMessages: 1 }
      });
    }

    res.status(201).json({
      id: newMessage._id,
      sender: req.user.fullName,
      text: newMessage.text,
      time: new Date(newMessage.time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      isMe: true
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark messages as read
// @route   PATCH /api/chats/:chatId/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark all messages from other user as read
    let unreadCount = 0;
    chat.messages.forEach(msg => {
      if (msg.senderId.toString() !== req.user._id.toString() && !msg.isRead) {
        msg.isRead = true;
        unreadCount++;
      }
    });

    await chat.save();

    // Update user's unread message count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { unreadMessages: -unreadCount }
    });

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
