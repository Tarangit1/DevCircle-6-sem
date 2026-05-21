import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  verified: {
    type: Boolean,
    default: false
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  unreadMessages: {
    type: Number,
    default: 0
  },
  unreadNotifications: {
    type: Number,
    default: 0
  },
  joinedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for total likes across all posts
UserSchema.virtual('totalLikes', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'authorId',
  count: true
});

export default mongoose.model('User', UserSchema);
