import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Feed & Home
  getFeedPosts: async () => {
    const response = await axiosInstance.get('/posts');
    return response.data;
  },
  
  getBookmarks: async () => {
    const response = await axiosInstance.get('/posts/bookmarks');
    return response.data;
  },

  // Projects
  getProjects: async () => {
    const response = await axiosInstance.get('/projects');
    return response.data;
  },
  
  // Bounties
  getBounties: async () => {
    const response = await axiosInstance.get('/bounties');
    return response.data;
  },

  // Leaderboard
  getLeaderboard: async (timeframe = 'This Week') => {
    const response = await axiosInstance.get('/leaderboard', { params: { timeframe } });
    return response.data;
  },

  // Messages
  getMessages: async () => {
    const response = await axiosInstance.get('/chats');
    return response.data;
  },

  // Right Widgets Data
  getWidgetData: async () => {
    const response = await axiosInstance.get('/widgets');
    return response.data;
  },

  // User Actions
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getUserProfile: async (username) => {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  },

  // Post Detail
  getPostDetail: async (id) => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  // Auth
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Post Actions
  createPost: async (postData) => {
    const response = await axiosInstance.post('/posts', postData);
    return response.data;
  },

  updatePost: async (postId, postData) => {
    const response = await axiosInstance.put(`/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    return response.data;
  },

  bookmarkPost: async (postId) => {
    const response = await axiosInstance.post(`/posts/${postId}/bookmark`);
    return response.data;
  },

  addComment: async (postId, commentData) => {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  markCommentAsWinner: async (postId, commentId) => {
    const response = await axiosInstance.patch(`/posts/${postId}/comments/${commentId}/winner`);
    return response.data;
  },

  // User Actions
  updateProfile: async (profileData) => {
    console.log('API: Sending profile update request with data:', profileData);
    try {
      const response = await axiosInstance.patch('/users/me', profileData);
      console.log('API: Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Profile update error:', error.response?.data || error.message);
      throw error;
    }
  },

  connectWithUser: async (userId) => {
    const response = await axiosInstance.post(`/users/${userId}/connect`);
    return response.data;
  },

  // Chat Actions
  createOrGetChat: async (userId) => {
    const response = await axiosInstance.post('/chats', { userId });
    return response.data;
  },

  sendMessage: async (chatId, text) => {
    const response = await axiosInstance.post(`/chats/${chatId}/messages`, { text });
    return response.data;
  },

  markChatAsRead: async (chatId) => {
    const response = await axiosInstance.patch(`/chats/${chatId}/read`);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  markNotificationAsRead: async (notificationId) => {
    const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await axiosInstance.patch('/notifications/read-all');
    return response.data;
  },

  // File Upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
