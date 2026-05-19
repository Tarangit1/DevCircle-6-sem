import { 
  mockPosts, 
  trendingProjects, 
  topDevelopers, 
  activeBounties, 
  popularTags,
  mockProjects,
  topProjectsThisWeek,
  fullBounties,
  leaderboardData,
  mockChats
} from '../data/mockData';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Feed & Home
  getFeedPosts: async () => {
    await delay(600);
    return mockPosts;
  },
  
  // Projects
  getProjects: async () => {
    await delay(700);
    return mockProjects;
  },
  
  // Bounties
  getBounties: async () => {
    await delay(500);
    return fullBounties;
  },

  // Leaderboard
  getLeaderboard: async () => {
    await delay(600);
    return leaderboardData;
  },

  // Messages
  getMessages: async () => {
    await delay(400);
    return mockChats;
  },

  // Right Widgets Data
  getWidgetData: async () => {
    await delay(500);
    return {
      trending: trendingProjects,
      topDevs: topDevelopers,
      bounties: activeBounties,
      tags: popularTags
    };
  },

  // Profile
  getUserProfile: async (username) => {
    await delay(600);
    return {
      fullName: "Priyanshu",
      username: "priyanshu_dev",
      avatar: "https://i.pravatar.cc/150?img=12",
      badge: "Frontend Wizard",
      bio: "Building cool stuff for the web. Love Next.js and Tailwind.",
      connectionsCount: 245,
      joinedDate: "Joined March 2024",
      projects: mockProjects.slice(0, 2),
      posts: mockPosts.slice(0, 1)
    };
  },

  // Post Detail
  getPostDetail: async (id) => {
    await delay(700);
    return {
      ...mockPosts[0],
      comments: [
        {
          id: 101,
          author: { name: "Ananya Sharma", handle: "@code.with.ananya", avatar: "https://i.pravatar.cc/150?img=5" },
          content: "This looks amazing! What database are you using behind the scenes?",
          timeAgo: "2h",
          isWinner: false,
          replies: [
            {
              id: 102,
              author: { name: "Priyanshu", handle: "@priyanshu_dev", avatar: "https://i.pravatar.cc/150?img=12" },
              content: "Thanks! I'm using PostgreSQL with Prisma.",
              timeAgo: "1h",
              isWinner: false
            }
          ]
        },
        {
          id: 103,
          author: { name: "Rohit Verma", handle: "@rohitthedev", avatar: "https://i.pravatar.cc/150?img=15" },
          content: "I ran into a small bug on mobile view. The sidebar doesn't close properly.",
          timeAgo: "3h",
          isWinner: true, // Example of bounty winner
          replies: []
        }
      ]
    };
  }
};
