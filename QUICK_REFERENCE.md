# DevCircle - Quick Reference Card

## 🚀 Start Commands

```bash
# Start MongoDB
net start MongoDB                    # Windows
brew services start mongodb-community # Mac

# Backend
cd backend
npm install
npm run seed    # First time only
npm run dev     # Start server

# Frontend
cd frontend
npm install
npm run dev     # Start dev server
```

## 🔑 Test Login

```
Email: priyanshu@example.com
Password: password123
```

## 📍 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 🗂️ Key Files

### Backend
```
backend/
├── server.js              # Entry point
├── .env                   # Config (created)
├── models/User.js         # User schema
├── models/Post.js         # Post schema
├── controllers/authController.js
└── routes/authRoutes.js
```

### Frontend
```
frontend/
├── src/
│   ├── api/index.js       # API client ✅
│   ├── context/AuthContext.jsx  # Auth state ✅
│   ├── components/
│   │   ├── Auth.jsx       # Login/Register ✅
│   │   ├── Home.jsx       # Feed ✅
│   │   ├── Bounties.jsx   # ⏳ TODO
│   │   ├── Leaderboard.jsx # ⏳ TODO
│   │   └── Messages.jsx   # ⏳ TODO
```

## 🔌 API Quick Reference

### Auth
```javascript
// Register
POST /api/auth/register
Body: { fullName, username, email, password }

// Login
POST /api/auth/login
Body: { email, password }

// Get current user
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
```

### Posts
```javascript
// Get feed
GET /api/posts

// Get post detail
GET /api/posts/:id

// Create post
POST /api/posts
Headers: { Authorization: "Bearer <token>" }
Body: { title, desc, tags, badge }

// Like post
POST /api/posts/:id/like
Headers: { Authorization: "Bearer <token>" }

// Add comment
POST /api/posts/:id/comments
Headers: { Authorization: "Bearer <token>" }
Body: { content, parentCommentId }
```

### Users
```javascript
// Get profile
GET /api/users/:username

// Update profile
PATCH /api/users/me
Headers: { Authorization: "Bearer <token>" }
Body: { fullName, bio, badge, avatar }
```

## 🎨 Frontend Patterns

### API Call Pattern
```jsx
import { useState, useEffect } from 'react';
import { api } from '../api';

const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await api.getFeedPosts();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, []);
```

### Auth Context Usage
```jsx
import { useAuth } from '../context/AuthContext';

const { currentUser, login, logout, isAuthenticated } = useAuth();

// Login
const handleLogin = async () => {
  const result = await login({ email, password });
  if (result.success) {
    navigate('/home');
  }
};

// Access user data
<img src={currentUser?.avatar} />
<span>{currentUser?.fullName}</span>
```

### Protected Action
```jsx
const handleLike = async () => {
  try {
    const result = await api.likePost(postId);
    setLiked(result.liked);
    setLikesCount(result.likesCount);
  } catch (error) {
    if (error.response?.status === 401) {
      navigate('/login');
    }
  }
};
```

## 🔧 Common Tasks

### Add New API Endpoint

**Backend:**
```javascript
// 1. Add route (routes/postRoutes.js)
router.get('/posts/trending', getTrendingPosts);

// 2. Add controller (controllers/postController.js)
export const getTrendingPosts = async (req, res) => {
  const posts = await Post.find()
    .sort({ 'likes': -1 })
    .limit(10);
  res.json(posts);
};
```

**Frontend:**
```javascript
// 3. Add to API client (src/api/index.js)
getTrendingPosts: async () => {
  const response = await axiosInstance.get('/posts/trending');
  return response.data;
}

// 4. Use in component
const [trending, setTrending] = useState([]);
useEffect(() => {
  const fetch = async () => {
    const data = await api.getTrendingPosts();
    setTrending(data);
  };
  fetch();
}, []);
```

### Add Protected Route

```jsx
// 1. Create ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

// 2. Wrap route in App.jsx
<Route 
  path="/home" 
  element={<ProtectedRoute><Home /></ProtectedRoute>} 
/>
```

## 🐛 Debugging

### Check Backend
```bash
# Is MongoDB running?
mongo --eval "db.version()"

# Check backend logs
cd backend
npm run dev
# Look for "MongoDB Connected" and "Server running on port 5000"

# Test API directly
curl http://localhost:5000/api/health
```

### Check Frontend
```javascript
// Check token in browser console
localStorage.getItem('token')

// Check current user
// In component with useAuth:
console.log(currentUser);

// Check API calls in Network tab
// Dev Tools > Network > Filter: XHR
```

### Common Errors

**"Network Error"**
- Backend not running
- Wrong API URL
- CORS issue

**"401 Unauthorized"**
- No token in localStorage
- Token expired
- Wrong token format

**"Cannot read property of undefined"**
- Data not loaded yet
- Add optional chaining: `user?.name`
- Check loading state

## 📋 Next Steps Checklist

- [ ] Refactor Bounties.jsx
- [ ] Refactor Leaderboard.jsx
- [ ] Refactor Messages.jsx
- [ ] Wire like button
- [ ] Wire comment form
- [ ] Add ProtectedRoute
- [ ] Test everything

## 📚 Documentation

- **Main README:** `README.md`
- **Integration Guide:** `INTEGRATION_GUIDE.md`
- **Task List:** `TODO.md`
- **Handoff Summary:** `HANDOFF_SUMMARY.md`
- **Architecture:** `ARCHITECTURE.md`
- **This File:** `QUICK_REFERENCE.md`

## 🆘 Help

**Backend Issues:**
- Check `backend/README.md`
- Verify `.env` file
- Check MongoDB connection

**Frontend Issues:**
- Check browser console
- Check Network tab
- Verify token in localStorage

**API Issues:**
- Check `INTEGRATION_GUIDE.md`
- Test with Postman/Thunder Client
- Check backend logs

---

**Keep this file open while developing!** 📌
