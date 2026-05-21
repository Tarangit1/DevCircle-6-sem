import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { formatLikes } from '../utils/helpers.js';

// @desc    Get widget data (trending, top devs, bounties, tags)
// @route   GET /api/widgets
// @access  Public
export const getWidgetData = async (req, res) => {
  try {
    // Trending Projects (top 3 by likes)
    const trendingProjects = await Post.find({ badge: 'Building' })
      .populate('authorId')
      .sort({ 'likes': -1 })
      .limit(3)
      .lean();

    const trending = trendingProjects.map((project, index) => ({
      id: project._id,
      rank: index + 1,
      name: project.title,
      handle: `@${project.authorId.username}`,
      likes: project.likes.length,
      iconBg: index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-gray-800 border-gray-600' : 'bg-purple-600'
    }));

    // Top Developers (by total likes across all their posts)
    const allPosts = await Post.find().populate('authorId').lean();
    const userLikesMap = {};

    allPosts.forEach(post => {
      if (post.authorId) {
        const userId = post.authorId._id.toString();
        if (!userLikesMap[userId]) {
          userLikesMap[userId] = {
            user: post.authorId,
            totalLikes: 0
          };
        }
        userLikesMap[userId].totalLikes += post.likes.length;
      }
    });

    const topDevs = Object.values(userLikesMap)
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, 3)
      .map((item, index) => ({
        id: item.user._id,
        rank: index + 1,
        name: item.user.fullName,
        handle: `@${item.user.username}`,
        likes: formatLikes(item.totalLikes),
        avatar: item.user.avatar || `https://i.pravatar.cc/150?u=${item.user._id}`,
        medalColor: index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-600'
      }));

    // Active Bounties (top 3 recent)
    const activeBounties = await Post.find({ badge: 'Bounty', status: 'Active' })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const bountiesWithComments = await Promise.all(
      activeBounties.map(async (bounty) => {
        const commentCount = await Comment.countDocuments({ postId: bounty._id });
        const now = new Date();
        const createdAt = new Date(bounty.createdAt);
        const hoursAgo = Math.floor((now - createdAt) / (1000 * 60 * 60));
        
        let timeAgo;
        if (hoursAgo < 1) {
          timeAgo = 'Just now';
        } else if (hoursAgo < 24) {
          timeAgo = `${hoursAgo}h ago`;
        } else {
          const daysAgo = Math.floor(hoursAgo / 24);
          timeAgo = `${daysAgo}d ago`;
        }

        return {
          id: bounty._id,
          title: bounty.title,
          amount: bounty.bountyAmount,
          comments: commentCount,
          timeAgo
        };
      })
    );

    // Popular Tags (aggregate from all posts)
    const allPostsForTags = await Post.find().lean();
    const tagCounts = {};

    allPostsForTags.forEach(post => {
      post.tags.forEach(tag => {
        const normalizedTag = tag.toLowerCase();
        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
      });
    });

    const popularTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name: `#${name}`,
        count: formatLikes(count)
      }));

    res.json({
      trending,
      topDevs,
      bounties: bountiesWithComments,
      tags: popularTags
    });
  } catch (error) {
    console.error('Get widget data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get leaderboard (top 10 projects by likes)
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    const { timeframe } = req.query;
    let dateFilter = {};

    if (timeframe === 'This Week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter.createdAt = { $gte: oneWeekAgo };
    } else if (timeframe === 'This Month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      dateFilter.createdAt = { $gte: oneMonthAgo };
    }

    const topProjects = await Post.aggregate([
      { $match: { badge: 'Building', ...dateFilter } },
      { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorId'
        }
      },
      { $unwind: { path: '$authorId', preserveNullAndEmptyArrays: true } }
    ]);

    const leaderboard = topProjects.map((project, index) => ({
      rank: index + 1,
      id: project._id,
      title: project.title,
      verified: project.authorId?.verified || false,
      desc: project.desc,
      author: `@${project.authorId?.username || 'unknown'}`,
      likes: formatLikes(project.likesCount),
      image: project.thumbnail || `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&q=80`,
      badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : undefined
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
