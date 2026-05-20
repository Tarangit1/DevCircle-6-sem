# DevCircle - Developer Social Platform

A full-stack MERN (MongoDB, Express, React, Node.js) social platform built for developers to showcase projects, collaborate, and connect with the community.

![DevCircle](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

## ✨ Features

### Implemented ✅
- **User Authentication** - JWT-based registration and login
- **Home Feed** - Browse posts from the developer community
- **Projects Showcase** - Display and discover developer projects
- **Bounties System** - Post and solve coding challenges for rewards
- **Leaderboard** - Top projects and developers ranked by engagement
- **User Profiles** - View developer profiles with projects and posts
- **Comments & Discussions** - Engage with posts through nested comments
- **Real-time Messaging** - Chat with other developers
- **Widgets** - Trending projects, top developers, active bounties, popular tags

### Coming Soon 🚧
- Like and bookmark functionality
- Profile editing
- Image uploads (Cloudinary/S3)
- Search and filters
- Real-time notifications
- WebSocket integration for live chat

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Quick Start

### Option 1: Automated Start (Windows)
```bash
# Double-click or run:
start-dev.bat
```

### Option 2: Manual Start

#### 1. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed  # Populate database with sample data
npm run dev   # Start backend server
```

#### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev   # Start frontend dev server
```

#### 4. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🔑 Test Credentials

After running `npm run seed` in the backend:

```
Email: priyanshu@example.com
Password: password123
```

Or use any other seeded user email with the same password.

## 📁 Project Structure

```
devcircle/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Database seeding
│   ├── utils/           # Helper functions
│   ├── .env.example     # Environment variables template
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── assets/      # Images and static files
│   │   ├── components/  # React components
│   │   ├── context/     # React context (Auth)
│   │   ├── data/        # Mock data (to be removed)
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── INTEGRATION_GUIDE.md  # Detailed integration guide
├── README.md             # This file
├── start-dev.bat         # Windows startup script
└── start-dev.sh          # Unix startup script
```

## 📚 API Documentation

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
- `POST /api/posts/:id/bookmark` - Bookmark post (protected)
- `POST /api/posts/:id/comments` - Add comment (protected)
- `PATCH /api/posts/:postId/comments/:commentId/winner` - Mark bounty winner (protected)

### Users
- `GET /api/users/:username` - Get user profile
- `PATCH /api/users/me` - Update profile (protected)
- `POST /api/users/:userId/connect` - Connect with user (protected)

### Widgets & Leaderboard
- `GET /api/widgets` - Get widget data
- `GET /api/leaderboard` - Get top 10 projects

### Chats
- `GET /api/chats` - Get all chats (protected)
- `POST /api/chats` - Create or get chat (protected)
- `POST /api/chats/:chatId/messages` - Send message (protected)
- `PATCH /api/chats/:chatId/read` - Mark messages as read (protected)

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devcircle
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check `.env` file exists with correct values
- Verify port 5000 is available

### Frontend can't connect
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Clear browser cache and localStorage

### Authentication issues
- Clear localStorage: `localStorage.clear()`
- Verify JWT_SECRET is set in backend
- Check token in browser dev tools (Application > Local Storage)

## 📖 Development Guide

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for:
- Detailed setup instructions
- Component refactoring guide
- Action button wiring
- Protected routes setup
- Next steps and roadmap

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- UI Design inspired by modern developer platforms
- Icons by Lucide React
- Sample avatars from Pravatar

## 📞 Support

For issues and questions:
- Check the [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- Review API documentation above
- Check browser console and network tab for errors

---

**Built with ❤️ for the developer community**
