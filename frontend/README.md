# DevCircle - MERN Stack Migration Guide

DevCircle is a developer-centric social platform allowing developers to share projects, discuss ideas, and hunt bounties. 

Currently, the project is a **Vite React Frontend** utilizing mocked API calls. The next major phase is integrating a **Node.js/Express & MongoDB** backend to convert this into a fully functioning **MERN stack** application.

---

## 💾 Database Schema Reference (MongoDB / Mongoose)

When you begin building the Node/Express backend, these are the recommended schemas based directly on the frontend UI requirements and DevCircle project specification.

### 1. User Schema
```javascript
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  badge: { type: String, default: '' }, // e.g. "Frontend Wizard", "Bug Hunter"
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User IDs
  joinedDate: { type: Date, default: Date.now },
  role: { type: String, default: 'developer' }
});
```

### 2. Post / Project Schema
```javascript
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deployedLink: { type: String, required: true }, // The live URL
  techStack: [{ type: String }], // e.g. ["React", "Node.js"]
  thumbnail: { type: String }, // Image URL
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users who liked
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }
});
```

### 3. Thread / Bug Bounty Schema
```javascript
const ThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }], // "discussion", "advice", "bounty", "bug", "solved bug", "building"
  bountyAmount: { type: String, default: null }, // e.g., "$150"
  status: { type: String, default: 'open' }, // "open" (bug) or "solved" (solved bug)
  winningCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  images: [{ type: String }], // Array of image URLs for bug screenshots
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }
});
```

### 4. Comment Schema
```javascript
const CommentSchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can reference a Post, Project, or Thread
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isWinner: { type: Boolean, default: false }, // Used for Bounty selection
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // For nested replies
  createdAt: { type: Date, default: Date.now }
});
```
