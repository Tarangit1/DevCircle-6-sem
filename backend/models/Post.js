import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  deployedLink: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    enum: ['Building', 'Discussion', 'Bounty', 'Help', ''],
    default: ''
  },
  bountyAmount: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Solved', 'Closed'],
    default: 'Active'
  },
  category: {
    type: String,
    enum: ['Web', 'Mobile', 'Backend', 'DevOps', 'AI/ML', 'Other'],
    default: 'Web'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  mockImage: {
    type: String,
    default: ''
  },
  imageBg: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconBg: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: ''
  },
  submissions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for comment count
PostSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  count: true
});

export default mongoose.model('Post', PostSchema);
