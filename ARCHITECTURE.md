# DevCircle - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + Vite)                            │
│                   Port: 5173                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │   Context    │     │
│  │              │  │              │  │              │     │
│  │ • Home       │  │ • Sidebar    │  │ • AuthContext│     │
│  │ • Projects   │  │ • PostCard   │  │              │     │
│  │ • Profile    │  │ • Navbar     │  │              │     │
│  │ • Messages   │  │ • Widgets    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Client (Axios)                       │  │
│  │  • JWT Token Interceptor                             │  │
│  │  • Base URL: http://localhost:5000/api               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ HTTP/REST
                       │ JSON
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                         BACKEND                              │
│                   (Node.js + Express)                        │
│                      Port: 5000                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Middleware                          │  │
│  │  • CORS                                               │  │
│  │  • JSON Parser                                        │  │
│  │  • JWT Authentication                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │ Controllers  │  │    Models    │     │
│  │              │  │              │  │              │     │
│  │ • Auth       │  │ • Auth       │  │ • User       │     │
│  │ • Posts      │  │ • Posts      │  │ • Post       │     │
│  │ • Users      │  │ • Users      │  │ • Comment    │     │
│  │ • Chats      │  │ • Chats      │  │ • Chat       │     │
│  │ • Widgets    │  │ • Widgets    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Mongoose ODM
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                       DATABASE                               │
│                       (MongoDB)                              │
│                  Port: 27017                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   users      │  │    posts     │  │   comments   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐                                           │
│  │    chats     │                                           │
│  └──────────────┘                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Authentication Flow
```
┌─────────┐                ┌─────────┐                ┌──────────┐
│ User    │                │ Backend │                │ Database │
└────┬────┘                └────┬────┘                └────┬─────┘
     │                          │                          │
     │ 1. POST /auth/register   │                          │
     │ { email, password, ... } │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │                          │ 2. Hash password         │
     │                          │    (bcrypt)              │
     │                          │                          │
     │                          │ 3. Save user             │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │ 4. User created          │
     │                          │<─────────────────────────┤
     │                          │                          │
     │                          │ 5. Generate JWT          │
     │                          │    (jsonwebtoken)        │
     │                          │                          │
     │ 6. { token, user }       │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │ 7. Store token in        │                          │
     │    localStorage          │                          │
     │                          │                          │
```

### Protected Request Flow
```
┌─────────┐                ┌─────────┐                ┌──────────┐
│ Frontend│                │ Backend │                │ Database │
└────┬────┘                └────┬────┘                └────┬─────┘
     │                          │                          │
     │ 1. GET /api/posts        │                          │
     │ Authorization: Bearer    │                          │
     │ <token>                  │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │                          │ 2. Verify JWT            │
     │                          │    (middleware)          │
     │                          │                          │
     │                          │ 3. Query posts           │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │ 4. Posts data            │
     │                          │<─────────────────────────┤
     │                          │                          │
     │                          │ 5. Transform data        │
     │                          │    (helpers)             │
     │                          │                          │
     │ 6. JSON response         │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
```

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  avatar: String (URL),
  bio: String,
  badge: String,
  verified: Boolean,
  connections: [ObjectId] (ref: User),
  unreadMessages: Number,
  unreadNotifications: Number,
  joinedDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Post Collection
```javascript
{
  _id: ObjectId,
  authorId: ObjectId (ref: User),
  title: String,
  desc: String,
  tags: [String],
  thumbnail: String (URL),
  deployedLink: String (URL),
  badge: String (Building/Discussion/Bounty),
  bountyAmount: String,
  status: String (Active/Solved/Closed),
  category: String,
  likes: [ObjectId] (ref: User),
  bookmarks: [ObjectId] (ref: User),
  mockImage: String,
  imageBg: String,
  icon: String,
  iconBg: String,
  iconColor: String,
  submissions: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Collection
```javascript
{
  _id: ObjectId,
  postId: ObjectId (ref: Post),
  authorId: ObjectId (ref: User),
  content: String,
  isWinner: Boolean,
  parentCommentId: ObjectId (ref: Comment, nullable),
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Collection
```javascript
{
  _id: ObjectId,
  participants: [ObjectId] (ref: User),
  messages: [
    {
      senderId: ObjectId (ref: User),
      text: String,
      isRead: Boolean,
      time: Date
    }
  ],
  lastMessage: String,
  updatedAt: Date,
  createdAt: Date
}
```

## 🔐 Authentication System

### JWT Token Structure
```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    id: "user_id_here",
    iat: 1234567890,  // Issued at
    exp: 1237159890   // Expires in 30 days
  },
  signature: "..."
}
```

### Token Flow
1. User logs in with email/password
2. Backend verifies credentials
3. Backend generates JWT with user ID
4. Frontend stores token in localStorage
5. Frontend sends token in Authorization header for protected requests
6. Backend middleware verifies token and attaches user to request

## 🛣️ API Routes Structure

```
/api
├── /auth
│   ├── POST   /register      - Create new user
│   ├── POST   /login         - Authenticate user
│   └── GET    /me            - Get current user (protected)
│
├── /posts
│   ├── GET    /              - Get all posts
│   ├── GET    /:id           - Get post by ID
│   ├── POST   /              - Create post (protected)
│   ├── POST   /:id/like      - Like/unlike post (protected)
│   ├── POST   /:id/bookmark  - Bookmark post (protected)
│   └── POST   /:id/comments  - Add comment (protected)
│
├── /projects
│   └── GET    /              - Get all projects
│
├── /bounties
│   └── GET    /              - Get all bounties
│
├── /users
│   ├── GET    /:username     - Get user profile
│   ├── PATCH  /me            - Update profile (protected)
│   └── POST   /:userId/connect - Connect with user (protected)
│
├── /widgets
│   └── GET    /              - Get widget data
│
├── /leaderboard
│   └── GET    /              - Get top projects
│
└── /chats
    ├── GET    /              - Get all chats (protected)
    ├── POST   /              - Create/get chat (protected)
    ├── POST   /:id/messages  - Send message (protected)
    └── PATCH  /:id/read      - Mark as read (protected)
```

## 🔄 Component Hierarchy

```
App
├── Router
│   ├── Landing (/)
│   │   ├── Navbar
│   │   ├── Hero
│   │   └── About
│   │
│   ├── Auth (/login, /signup)
│   │   └── Auth Form
│   │
│   └── Dashboard (Protected)
│       ├── Sidebar
│       │   ├── Logo
│       │   ├── Navigation
│       │   └── User Profile Pill
│       │
│       ├── Home (/home)
│       │   ├── DashboardHeader
│       │   ├── Create Post Box
│       │   ├── Feed Filters
│       │   ├── PostCard (multiple)
│       │   └── RightWidgets
│       │       ├── Trending Projects
│       │       ├── Top Developers
│       │       ├── Active Bounties
│       │       └── Popular Tags
│       │
│       ├── Projects (/projects)
│       │   ├── DashboardHeader
│       │   ├── Filters
│       │   └── Project Cards
│       │
│       ├── Bounties (/bounties)
│       │   ├── DashboardHeader
│       │   ├── Filters
│       │   └── Bounty Cards
│       │
│       ├── Leaderboard (/leaderboard)
│       │   ├── DashboardHeader
│       │   └── Leaderboard List
│       │
│       ├── Messages (/messages)
│       │   ├── Chat List
│       │   └── Chat Window
│       │
│       ├── Profile (/profile/:username)
│       │   ├── Profile Header
│       │   ├── User Info
│       │   ├── Projects Tab
│       │   └── Posts Tab
│       │
│       ├── PostDetail (/posts/:id)
│       │   ├── Post Content
│       │   ├── Comments List
│       │   └── Comment Form
│       │
│       └── CreateProject (/create-project)
│           └── Project Form
```

## 🔌 State Management

### Global State (AuthContext)
```javascript
{
  currentUser: {
    id: String,
    fullName: String,
    username: String,
    email: String,
    avatar: String,
    badge: String,
    bio: String,
    verified: Boolean,
    unreadMessages: Number,
    unreadNotifications: Number
  },
  loading: Boolean,
  isAuthenticated: Boolean,
  login: Function,
  register: Function,
  logout: Function,
  updateUser: Function
}
```

### Local State (Component Level)
- Posts list
- Loading states
- Form inputs
- UI toggles
- Error messages

## 🚀 Performance Considerations

### Current Implementation
- ✅ JWT tokens for stateless auth
- ✅ Mongoose lean() for faster queries
- ✅ Indexed fields (email, username)
- ✅ Pagination-ready structure

### Future Optimizations
- [ ] React Query for caching
- [ ] Lazy loading components
- [ ] Image optimization
- [ ] Database indexing
- [ ] Redis caching
- [ ] CDN for static assets

## 🔒 Security Features

### Implemented
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ CORS enabled
- ✅ Protected routes
- ✅ Input validation

### Recommended Additions
- [ ] Rate limiting
- [ ] Request validation (express-validator)
- [ ] Helmet.js for security headers
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Input sanitization

## 📱 Responsive Design

The frontend is built with responsive CSS:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Key responsive components:
- Sidebar (collapsible on mobile)
- Grid layouts (flex-wrap)
- Navigation (hamburger menu)
- Cards (stack on mobile)

---

**Last Updated:** [Current Date]
