import express from 'express';
import {
  getFeedPosts,
  getProjects,
  getBounties,
  getPostDetail,
  createPost,
  toggleLike,
  toggleBookmark,
  addComment,
  markCommentAsWinner
} from '../controllers/postController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', optionalAuth, getFeedPosts);
router.get('/projects', optionalAuth, getProjects);
router.get('/bounties', optionalAuth, getBounties);
router.get('/posts/:id', optionalAuth, getPostDetail);

router.post('/posts', protect, createPost);
router.post('/posts/:id/like', protect, toggleLike);
router.post('/posts/:id/bookmark', protect, toggleBookmark);
router.post('/posts/:id/comments', protect, addComment);
router.patch('/posts/:postId/comments/:commentId/winner', protect, markCommentAsWinner);

export default router;
