export const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Priyanshu',
      handle: '@priyanshu_dev',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true
    },
    timeAgo: '4h',
    badge: 'Building',
    title: 'ShipFast - Dev Deployment Platform',
    desc: 'An open-source platform to deploy your apps in seconds. Built for developers, by developers.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker'],
    mockImage: 'shipfast',
    stats: { likes: 342, comments: 28 }
  },
  {
    id: 2,
    author: {
      name: 'Ananya Sharma',
      handle: '@code.with.ananya',
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: true
    },
    timeAgo: '6h',
    badge: 'Discussion',
    title: 'How do you handle authentication in large-scale apps?',
    desc: 'I\'m building a multi-tenant SaaS and struggling with auth at scale. What approach do you guys recommend?',
    tags: [],
    mockImage: null,
    stats: { likes: 128, comments: 65 }
  },
  {
    id: 3,
    author: {
      name: 'Rohit Verma',
      handle: '@rohitthedev',
      avatar: 'https://i.pravatar.cc/150?img=15',
      verified: false
    },
    timeAgo: '8h',
    badge: 'Bounty',
    title: 'Bug in real-time chat - message delivered but not showing',
    desc: 'Messages are getting delivered to the server but sometimes not appearing on the receiver side. Need help fixing this.',
    tags: [],
    mockImage: null,
    bountyAmount: '$150',
    stats: { likes: 23, comments: 17 }
  },
  {
    id: 4,
    author: {
      name: 'Neha Singh',
      handle: '@nehasingh',
      avatar: 'https://i.pravatar.cc/150?img=9',
      verified: true
    },
    timeAgo: '10h',
    badge: 'Building',
    title: 'FocusMate - Stay productive together',
    desc: 'A productivity app that connects you with a partner to help you stay focused and get things done.',
    tags: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
    mockImage: 'focusmate',
    stats: { likes: 214, comments: 41 }
  }
];

export const trendingProjects = [
  { id: 1, rank: 1, name: 'ShipFast', handle: '@priyanshu_dev', likes: 342, iconBg: 'bg-blue-600' },
  { id: 2, rank: 2, name: 'DevRadar', handle: '@adarsh.dev', likes: 298, iconBg: 'bg-gray-800 border-gray-600' },
  { id: 3, rank: 3, name: 'FocusMate', handle: '@nehasingh', likes: 214, iconBg: 'bg-purple-600' }
];

export const topDevelopers = [
  { id: 1, rank: 1, name: 'Priyanshu', handle: '@priyanshu_dev', likes: '2.4k', avatar: 'https://i.pravatar.cc/150?img=12', medalColor: 'text-yellow-500' },
  { id: 2, rank: 2, name: 'Ananya Sharma', handle: '@code.with.ananya', likes: '1.8k', avatar: 'https://i.pravatar.cc/150?img=5', medalColor: 'text-gray-400' },
  { id: 3, rank: 3, name: 'Rohit Verma', handle: '@rohitthedev', likes: '1.5k', avatar: 'https://i.pravatar.cc/150?img=15', medalColor: 'text-orange-600' }
];

export const activeBounties = [
  { id: 1, title: 'Fix memory leak in image processing API', amount: '$200', comments: 12, timeAgo: '2h ago' },
  { id: 2, title: 'Auth bypass in user profile edit', amount: '$150', comments: 18, timeAgo: '5h ago' },
  { id: 3, title: 'Real-time chat message sync issue', amount: '$150', comments: 17, timeAgo: '8h ago' }
];

export const popularTags = [
  { name: '#javascript', count: '1.2k' },
  { name: '#reactjs', count: '1k' },
  { name: '#typescript', count: '843' },
  { name: '#nextjs', count: '689' },
  { name: '#nodejs', count: '568' },
  { name: '#python', count: '432' },
  { name: '#systemdesign', count: '391' },
  { name: '#docker', count: '310' }
];

export const mockProjects = [
  {
    id: 1,
    title: 'DevAnalytics',
    verified: true,
    desc: 'Open-source analytics dashboard for developers and startups.',
    tags: ['Next.js', 'Tailwind CSS', 'PostgreSQL'],
    author: { handle: '@sarthak', avatar: 'https://i.pravatar.cc/150?img=11' },
    stats: { likes: '1.2K', comments: 128 },
    imageBg: 'bg-gradient-to-br from-blue-900 to-black'
  },
  {
    id: 2,
    title: 'MindMate AI',
    verified: true,
    desc: 'AI assistant for coders to generate, explain and optimize code.',
    tags: ['Next.js', 'OpenAI API', 'Prisma'],
    author: { handle: '@priyanshu', avatar: 'https://i.pravatar.cc/150?img=12' },
    stats: { likes: 987, comments: 96 },
    imageBg: 'bg-gradient-to-br from-purple-900 to-black'
  },
  {
    id: 3,
    title: 'ShipTrack',
    verified: true,
    desc: 'Project management tool built for fast-moving dev teams.',
    tags: ['React', 'Node.js', 'MongoDB'],
    author: { handle: '@devesh', avatar: 'https://i.pravatar.cc/150?img=13' },
    stats: { likes: 876, comments: 74 },
    imageBg: 'bg-gradient-to-br from-blue-500 to-indigo-900'
  },
  {
    id: 4,
    title: 'CollabCode',
    verified: true,
    desc: 'Real-time collaborative code editor for interviews and pair programming.',
    tags: ['TypeScript', 'WebRTC', 'Y.js'],
    author: { handle: '@aman_j', avatar: 'https://i.pravatar.cc/150?img=14' },
    stats: { likes: 745, comments: 52 },
    imageBg: 'bg-gradient-to-br from-teal-500 to-emerald-900'
  },
  {
    id: 5,
    title: 'Authless',
    verified: false,
    desc: 'Passwordless authentication made simple and secure.',
    tags: ['Next.js', 'Auth.js', 'Tailwind CSS'],
    author: { handle: '@tanay_01', avatar: 'https://i.pravatar.cc/150?img=15' },
    stats: { likes: 631, comments: 41 },
    imageBg: 'bg-gradient-to-br from-gray-800 to-black'
  },
  {
    id: 6,
    title: 'StudyFlow',
    verified: true,
    desc: 'AI-powered learning platform for developers.',
    tags: ['React', 'Firebase', 'OpenAI API'],
    author: { handle: '@riya_codes', avatar: 'https://i.pravatar.cc/150?img=5' },
    stats: { likes: 589, comments: 38 },
    imageBg: 'bg-gradient-to-br from-indigo-500 to-purple-900'
  }
];

export const topProjectsThisWeek = [
  { id: 1, rank: 1, name: 'DevAnalytics', likes: '1.2K', color: 'text-yellow-500' },
  { id: 2, rank: 2, name: 'MindMate AI', likes: '987', color: 'text-gray-400' },
  { id: 3, rank: 3, name: 'ShipTrack', likes: '876', color: 'text-orange-500' },
  { id: 4, rank: 4, name: 'CollabCode', likes: '745', color: 'text-gray-500' },
  { id: 5, rank: 5, name: 'Authless', likes: '631', color: 'text-gray-500' }
];

export const fullBounties = [
  {
    id: 1,
    title: 'Fix hydration error on dashboard page',
    status: 'Active',
    category: 'Web',
    desc: 'There is a hydration mismatch error on the dashboard when switching theme. Needs investigation and fix.',
    tags: ['Next.js', 'React', 'TypeScript'],
    author: { handle: '@priyanshu', avatar: 'https://i.pravatar.cc/150?img=12' },
    timeAgo: '2h ago',
    amount: '$150',
    comments: 12,
    submissions: 24,
    icon: 'N',
    iconBg: 'bg-indigo-900',
    iconColor: 'text-indigo-400'
  },
  {
    id: 2,
    title: 'Prevent duplicate submissions in forms',
    status: 'Active',
    category: 'Web',
    desc: 'Users can submit the form multiple times rapidly. Add validation or locking to prevent duplicate submissions.',
    tags: ['JavaScript', 'HTML', 'CSS'],
    author: { handle: '@aman_j', avatar: 'https://i.pravatar.cc/150?img=14' },
    timeAgo: '5h ago',
    amount: '$100',
    comments: 8,
    submissions: 15,
    icon: 'E',
    iconBg: 'bg-gray-100',
    iconColor: 'text-black'
  },
  {
    id: 3,
    title: 'Fix slow queries in leaderboard API',
    status: 'Active',
    category: 'Backend',
    desc: 'Leaderboard API is taking too long to respond under high load. Optimize the queries and improve performance.',
    tags: ['Node.js', 'MongoDB', 'Express'],
    author: { handle: '@tanay_01', avatar: 'https://i.pravatar.cc/150?img=15' },
    timeAgo: '1d ago',
    amount: '$200',
    comments: 15,
    submissions: 32,
    icon: '⚡',
    iconBg: 'bg-emerald-900',
    iconColor: 'text-emerald-400'
  },
  {
    id: 4,
    title: 'XSS vulnerability in comment section',
    status: 'Solved',
    category: 'Web',
    desc: 'There is a potential XSS vulnerability in the comment section. Sanitize the input properly.',
    tags: ['Security', 'Web', 'HTML'],
    author: { handle: '@cyberdev', avatar: 'https://i.pravatar.cc/150?img=8' },
    timeAgo: '1d ago',
    amount: '$250',
    comments: 18,
    submissions: 27,
    icon: '🛡️',
    iconBg: 'bg-purple-900',
    iconColor: 'text-purple-400'
  },
  {
    id: 5,
    title: 'Image upload fails for large files',
    status: 'Solved',
    category: 'Mobile',
    desc: 'Users are unable to upload images larger than 5MB on the mobile app. Needs to be fixed and tested.',
    tags: ['React Native', 'AWS S3', 'Node.js'],
    author: { handle: '@mobile_dev', avatar: 'https://i.pravatar.cc/150?img=3' },
    timeAgo: '2d ago',
    amount: '$180',
    comments: 22,
    submissions: 14,
    icon: '🖼️',
    iconBg: 'bg-blue-900',
    iconColor: 'text-blue-400'
  }
];

export const leaderboardData = [
  { rank: 1, id: 101, title: 'DevAnalytics', verified: true, desc: 'Open-source analytics dashboard', author: '@sarthak', likes: '1.2K', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&q=80', badge: 'gold' },
  { rank: 2, id: 102, title: 'MindMate AI', verified: true, desc: 'AI assistant for developers', author: '@priyanshu', likes: '987', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&q=80', badge: 'silver' },
  { rank: 3, id: 103, title: 'ShipTrack', verified: true, desc: 'Project management for dev teams', author: '@devesh', likes: '876', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&q=80', badge: 'bronze' },
  { rank: 4, id: 104, title: 'CollabCode', verified: true, desc: 'Real-time collaborative code editor', author: '@aman_j', likes: '745', image: 'https://images.unsplash.com/photo-1607799279861-4ddf4e262118?w=150&q=80' },
  { rank: 5, id: 105, title: 'Authless', verified: true, desc: 'Passwordless authentication', author: '@tanay_01', likes: '631', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=150&q=80' },
  { rank: 6, id: 106, title: 'StudyFlow', verified: true, desc: 'AI learning platform for developers', author: '@riya_codes', likes: '589', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&q=80' },
  { rank: 7, id: 107, title: 'SecureNote', verified: true, desc: 'End-to-end encrypted notes', author: '@cyberdev', likes: '512', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&q=80' },
  { rank: 8, id: 108, title: 'ByteBoard', verified: true, desc: 'Minimal kanban board for devs', author: '@rohit_dev', likes: '476', image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&q=80' },
  { rank: 9, id: 109, title: 'ShopDev', verified: true, desc: 'E-commerce starter kit', author: '@hexorbit', likes: '432', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&q=80' },
  { rank: 10, id: 110, title: 'DevConnect', verified: true, desc: 'Developer networking platform', author: '@codecat', likes: '410', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&q=80' }
];

export const mockChats = [
  {
    id: 1,
    user: { name: 'Priyanshu', avatar: 'https://i.pravatar.cc/150?img=12', online: true },
    lastMessage: 'Hey, thanks for reviewing my project!...',
    time: '2:30 PM',
    unread: 2,
    messages: [
      { id: 1, sender: 'Priyanshu', text: 'Hey Arjun! 👋\nI checked out your project DevAnalytics.\nReally impressed with the dashboard UI!', time: '2:28 PM', isMe: false },
      { id: 2, sender: 'Me', text: 'Hey Priyanshu! Thanks a lot 🙌\nMeans a lot coming from you!', time: '2:29 PM', isMe: true },
      { id: 3, sender: 'Priyanshu', text: 'I had a quick question about the charts section.\nWhich library did you use for those?', time: '2:29 PM', isMe: false },
      { id: 4, sender: 'Me', text: 'I used Recharts. It\'s pretty flexible and easy to customize.', time: '2:30 PM', isMe: true },
      { id: 5, sender: 'Priyanshu', text: 'Great! Thanks for letting me know.\nAlso, I\'ve created a pull request to fix a small UI issue in dark mode.\nLet me know your thoughts!', time: '2:30 PM', isMe: false },
      { id: 6, sender: 'Me', text: 'Hey, thanks for reviewing my project!\nI\'ll check the PR and merge it.', time: '2:30 PM', isMe: true }
    ]
  },
  {
    id: 2,
    user: { name: 'Tanay Sharma', avatar: 'https://i.pravatar.cc/150?img=11', online: true },
    lastMessage: 'Yeah, I\'ll fix that and push the update.',
    time: '1:45 PM',
    unread: 1,
    messages: []
  },
  {
    id: 3,
    user: { name: 'Devansh', avatar: 'https://i.pravatar.cc/150?img=15', online: true },
    lastMessage: 'The API rate limit issue is resolved.',
    time: '11:20 AM',
    unread: 0,
    messages: []
  },
  {
    id: 4,
    user: { name: 'Riya Codes', avatar: 'https://i.pravatar.cc/150?img=5', online: false },
    lastMessage: 'Sounds good! Let\'s connect tomorrow.',
    time: 'Yesterday',
    unread: 0,
    messages: []
  },
  {
    id: 5,
    user: { name: 'Aman Jain', avatar: 'https://i.pravatar.cc/150?img=14', online: false },
    lastMessage: 'Can you share the database schema?',
    time: 'Yesterday',
    unread: 0,
    messages: []
  },
  {
    id: 6,
    user: { name: 'Neha Verma', avatar: 'https://i.pravatar.cc/150?img=9', online: true },
    lastMessage: 'I\'ve sent you the required files.',
    time: '2d ago',
    unread: 0,
    messages: []
  },
  {
    id: 7,
    user: { name: 'CodeCat', avatar: 'https://i.pravatar.cc/150?img=8', online: true },
    lastMessage: 'Thanks for the help!',
    time: '2d ago',
    unread: 0,
    messages: []
  },
  {
    id: 8,
    user: { name: 'Sarthak', avatar: 'https://i.pravatar.cc/150?img=3', online: false },
    lastMessage: 'Let me know if you need anything else.',
    time: '3d ago',
    unread: 0,
    messages: []
  }
];
