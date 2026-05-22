import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Format time ago
export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm';
  
  return Math.floor(seconds) + 's';
};

// Format likes count
export const formatLikes = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

// Transform user to frontend format
export const transformUser = (user) => {
  // Generate initials-based avatar if no avatar exists
  const getDefaultAvatar = (fullName) => {
    const initials = fullName.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=ffffff&size=150&bold=true`;
  };

  return {
    id: user._id,
    name: user.fullName,
    handle: `@${user.username}`,
    avatar: user.avatar || getDefaultAvatar(user.fullName),
    verified: user.verified,
    badge: user.badge,
    bio: user.bio
  };
};

// Transform post to frontend format
export const transformPost = (post, includeAuthor = true, reqUser = null) => {
  const transformed = {
    id: post._id,
    title: post.title,
    desc: post.desc,
    tags: post.tags,
    badge: post.badge,
    timeAgo: getTimeAgo(post.createdAt),
    stats: {
      likes: post.likes?.length || 0,
      comments: post.commentCount || 0
    },
    isLiked: reqUser && post.likes ? post.likes.some(id => id.toString() === reqUser._id.toString()) : false,
    isBookmarked: reqUser && post.bookmarks ? post.bookmarks.some(id => id.toString() === reqUser._id.toString()) : false
  };

  if (includeAuthor && post.authorId) {
    transformed.author = transformUser(post.authorId);
  }

  if (post.bountyAmount) {
    transformed.bountyAmount = post.bountyAmount;
  }

  if (post.mockImage) {
    transformed.mockImage = post.mockImage;
  }

  if (post.imageBg) {
    transformed.imageBg = post.imageBg;
  }

  if (post.deployedLink) {
    transformed.deployedLink = post.deployedLink;
  }

  if (post.thumbnail) {
    transformed.thumbnail = post.thumbnail;
  }

  // For bounty posts
  if (post.status) {
    transformed.status = post.status;
  }

  if (post.category) {
    transformed.category = post.category;
  }

  if (post.icon) {
    transformed.icon = post.icon;
  }

  if (post.iconBg) {
    transformed.iconBg = post.iconBg;
  }

  if (post.iconColor) {
    transformed.iconColor = post.iconColor;
  }

  if (post.submissions !== undefined) {
    transformed.submissions = post.submissions;
  }

  return transformed;
};
