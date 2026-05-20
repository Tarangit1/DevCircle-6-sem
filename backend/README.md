# DevCircle Backend API

Node.js/Express/MongoDB backend for DevCircle - a developer social platform.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devcircle
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## Seeding the Database

To populate the database with sample data:

```bash
npm run seed
```

**Test Credentials:**
- Email: `priyanshu@example.com`
- Password: `password123`

(Or use any other seeded user email with the same password)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts & Projects
- `GET /api/posts` - Get all feed posts
- `GET /api/projects` - Get all projects
- `GET /api/bounties` - Get all bounties
- `GET /api/posts/:id` - Get post detail with comments
- `POST /api/posts` - Create new post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)
- `POST /api/posts/:id/bookmark` - Bookmark/unbookmark post (protected)
- `POST /api/posts/:id/comments` - Add comment to post (protected)
- `PATCH /api/posts/:postId/comments/:commentId/winner` - Mark comment as bounty winner (protected)

### Users
- `GET /api/users/:username` - Get user profile
- `PATCH /api/users/me` - Update own profile (protected)
- `POST /api/users/:userId/connect` - Connect/disconnect with user (protected)

### Widgets & Leaderboard
- `GET /api/widgets` - Get widget data (trending, top devs, bounties, tags)
- `GET /api/leaderboard` - Get top 10 projects leaderboard

### Chats
- `GET /api/chats` - Get all chats for logged-in user (protected)
- `POST /api/chats` - Create or get chat with a user (protected)
- `POST /api/chats/:chatId/messages` - Send message in chat (protected)
- `PATCH /api/chats/:chatId/read` - Mark messages as read (protected)

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── postController.js  # Posts/projects logic
│   ├── userController.js  # User profile logic
│   ├── widgetController.js # Widgets/leaderboard logic
│   └── chatController.js  # Chat/messaging logic
├── middleware/
│   └── auth.js            # JWT authentication
├── models/
│   ├── User.js            # User schema
│   ├── Post.js            # Post/project schema
│   ├── Comment.js         # Comment schema
│   └── Chat.js            # Chat/message schema
├── routes/
│   ├── authRoutes.js      # Auth routes
│   ├── postRoutes.js      # Post routes
│   ├── userRoutes.js      # User routes
│   ├── widgetRoutes.js    # Widget routes
│   └── chatRoutes.js      # Chat routes
├── scripts/
│   └── seed.js            # Database seeding script
├── utils/
│   └── helpers.js         # Helper functions
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js              # Main server file
```

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned upon successful login/registration.

## CORS

CORS is enabled for all origins in development. Update `server.js` for production.

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
