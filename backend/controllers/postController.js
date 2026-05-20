import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { transformPost, transformUser, getTimeAgo } from '../utils/helpers.js';
import { createNotification } from './notificationController.js';

// @desc    Get all feed posts
// @route   GET /api/posts
// @access  Public
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('authorId')
      .sort({ createdAt: -1 })
      .lean();

    // Get comment counts
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ postId: post._id });
        return { ...post, commentCount };
      })
    );

    const transformedPosts = postsWithCounts.map(post => transformPost(post));
    res.json(transformedPosts);
  } catch (error) {
    console.error('Get feed posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Post.find({ badge: 'Building' })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .lean();

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const commentCount = await Comment.countDocuments({ postId: project._id });
        return { ...project, commentCount };
      })
    );

    const transformedProjects = projectsWithCounts.map(project => {
      const transformed = transformPost(project);
      // Add verified flag from post if exists
      if (project.authorId) {
        transformed.verified = project.authorId.verified;
      }
      return transformed;
    });

    res.json(transformedProjects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bounties
// @route   GET /api/bounties
// @access  Public
export const getBounties = async (req, res) => {
  try {
    const bounties = await Post.find({ badge: 'Bounty' })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .lean();

    const bountiesWithCounts = await Promise.all(
      bounties.map(async (bounty) => {
        const commentCount = await Comment.countDocuments({ postId: bounty._id });
        return { ...bounty, commentCount };
      })
    );

    const transformedBounties = bountiesWithCounts.map(bounty => {
      const transformed = transformPost(bounty);
      transformed.amount = bounty.bountyAmount;
      transformed.comments = bounty.commentCount;
      return transformed;
    });

    res.json(transformedBounties);
  } catch (error) {
    console.error('Get bounties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get post detail with comments
// @route   GET /api/posts/:id
// @access  Public
export const getPostDetail = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId')
      .lean();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get comments with nested replies
    const comments = await Comment.find({ postId: post._id, parentCommentId: null })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .lean();

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentCommentId: comment._id })
          .populate('authorId')
          .sort({ createdAt: 1 })
          .lean();

        return {
          id: comment._id,
          author: {
            name: comment.authorId.fullName,
            handle: `@${comment.authorId.username}`,
            avatar: comment.authorId.avatar || `https://i.pravatar.cc/150?u=${comment.authorId._id}`
          },
          content: comment.content,
          timeAgo: getTimeAgo(comment.createdAt),
          isWinner: comment.isWinner,
          replies: replies.map(reply => ({
            id: reply._id,
            author: {
              name: reply.authorId.fullName,
              handle: `@${reply.authorId.username}`,
              avatar: reply.authorId.avatar || `https://i.pravatar.cc/150?u=${reply.authorId._id}`
            },
            content: reply.content,
            timeAgo: getTimeAgo(reply.createdAt),
            isWinner: reply.isWinner
          }))
        };
      })
    );

    const commentCount = await Comment.countDocuments({ postId: post._id });
    const transformedPost = transformPost({ ...post, commentCount });
    
    res.json({
      ...transformedPost,
      comments: commentsWithReplies
    });
  } catch (error) {
    console.error('Get post detail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new post/project
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, desc, tags, badge, bountyAmount, category, deployedLink, thumbnail } = req.body;

    if (!title || !desc) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const post = await Post.create({
      authorId: req.user._id,
      title,
      desc,
      tags: tags || [],
      badge: badge || '',
      bountyAmount: bountyAmount || '',
      category: category || 'Web',
      deployedLink: deployedLink || '',
      thumbnail: thumbnail || ''
    });

    const populatedPost = await Post.findById(post._id).populate('authorId').lean();
    const transformedPost = transformPost(populatedPost);

    res.status(201).json(transformedPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ 
      liked: likeIndex === -1,
      likesCount: post.likes.length 
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Bookmark/unbookmark a post
// @route   POST /api/posts/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const bookmarkIndex = post.bookmarks.indexOf(req.user._id);

    if (bookmarkIndex > -1) {
      // Remove bookmark
      post.bookmarks.splice(bookmarkIndex, 1);
    } else {
      // Add bookmark
      post.bookmarks.push(req.user._id);
    }

    await post.save();

    res.json({ 
      bookmarked: bookmarkIndex === -1
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      postId: req.params.id,
      authorId: req.user._id,
      content,
      parentCommentId: parentCommentId || null
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('authorId')
      .lean();

    res.status(201).json({
      id: populatedComment._id,
      author: {
        name: populatedComment.authorId.fullName,
        handle: `@${populatedComment.authorId.username}`,
        avatar: populatedComment.authorId.avatar || `https://i.pravatar.cc/150?u=${populatedComment.authorId._id}`
      },
      content: populatedComment.content,
      timeAgo: getTimeAgo(populatedComment.createdAt),
      isWinner: populatedComment.isWinner,
      replies: []
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark comment as bounty winner
// @route   PATCH /api/posts/:postId/comments/:commentId/winner
// @access  Private (post owner only)
export const markCommentAsWinner = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is post owner
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only post owner can mark winners' });
    }

    const comment = await Comment.findById(req.params.commentId).populate('authorId');
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.isWinner = true;
    await comment.save();

    // Update post status to Solved
    post.status = 'Solved';
    await post.save();

    // Send notification to comment author
    await createNotification(
      comment.authorId._id,
      req.user._id,
      'bounty_winner',
      `Congratulations! You won the bounty for "${post.title}"`,
      {
        postId: post._id,
        commentId: comment._id,
        bountyAmount: post.bountyAmount
      }
    );

    res.json({ message: 'Comment marked as winner', isWinner: true });
  } catch (error) {
    console.error('Mark winner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
