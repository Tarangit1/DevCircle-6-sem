import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Chat from '../models/Chat.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Chat.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.create([
      {
        fullName: 'Priyanshu',
        username: 'priyanshu_dev',
        email: 'priyanshu@example.com',
        password: hashedPassword,
        avatar: 'https://ui-avatars.com/api/?name=PR&background=6366f1&color=ffffff&size=150&bold=true',
        badge: 'Frontend Wizard',
        bio: 'Building cool stuff for the web. Love Next.js and Tailwind.',
        verified: true
      },
      {
        fullName: 'Ananya Sharma',
        username: 'code.with.ananya',
        email: 'ananya@example.com',
        password: hashedPassword,
        avatar: 'https://ui-avatars.com/api/?name=AS&background=6366f1&color=ffffff&size=150&bold=true',
        badge: 'Full Stack Developer',
        bio: 'Passionate about clean code and scalable architecture.',
        verified: true
      },
      {
        fullName: 'Rohit Verma',
        username: 'rohitthedev',
        email: 'rohit@example.com',
        password: hashedPassword,
        avatar: 'https://ui-avatars.com/api/?name=RV&background=6366f1&color=ffffff&size=150&bold=true',
        badge: 'Backend Specialist',
        bio: 'Node.js enthusiast. Building APIs that scale.',
        verified: false
      },
      {
        fullName: 'Neha Singh',
        username: 'nehasingh',
        email: 'neha@example.com',
        password: hashedPassword,
        avatar: 'https://ui-avatars.com/api/?name=NS&background=6366f1&color=ffffff&size=150&bold=true',
        badge: 'UI/UX Developer',
        bio: 'Creating beautiful and intuitive user experiences.',
        verified: true
      },
      {
        fullName: 'Arjun Dev',
        username: 'arjun_dev',
        email: 'arjun@example.com',
        password: hashedPassword,
        avatar: 'https://ui-avatars.com/api/?name=AD&background=6366f1&color=ffffff&size=150&bold=true',
        badge: 'Git Commit Monster',
        bio: 'Open source contributor. Love building developer tools.',
        verified: true,
        unreadMessages: 3,
        unreadNotifications: 8
      },
      {
        fullName: 'Sarthak',
        username: 'sarthak',
        email: 'sarthak@example.com',
        password: hashedPassword,
        avatar: 'https://ui-avatars.com/api/?name=S&background=6366f1&color=ffffff&size=150&bold=true',
        badge: 'Data Wizard',
        verified: true
      },
      {
        fullName: 'Tanay Sharma',
        username: 'tanay_01',
        email: 'tanay@example.com',
        password: hashedPassword,
        avatar: 'https://ui-avatars.com/api/?name=TS&background=6366f1&color=ffffff&size=150&bold=true',
        badge: 'Security Expert',
        verified: true
      },
      {
        fullName: 'Aman Jain',
        username: 'aman_j',
        email: 'aman@example.com',
        password: hashedPassword,
        avatar: 'https://ui-avatars.com/api/?name=AJ&background=6366f1&color=ffffff&size=150&bold=true',
        badge: 'DevOps Engineer',
        verified: true
      }
    ]);

    console.log('Users created');

    // Create posts
    const posts = await Post.create([
      {
        authorId: users[0]._id,
        title: 'ShipFast - Dev Deployment Platform',
        desc: 'An open-source platform to deploy your apps in seconds. Built for developers, by developers.',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker'],
        badge: 'Building',
        mockImage: 'shipfast',
        likes: [users[1]._id, users[2]._id, users[3]._id],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        authorId: users[1]._id,
        title: 'How do you handle authentication in large-scale apps?',
        desc: "I'm building a multi-tenant SaaS and struggling with auth at scale. What approach do you guys recommend?",
        tags: [],
        badge: 'Discussion',
        likes: [users[0]._id, users[2]._id],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        authorId: users[2]._id,
        title: 'Bug in real-time chat - message delivered but not showing',
        desc: 'Messages are getting delivered to the server but sometimes not appearing on the receiver side. Need help fixing this.',
        tags: [],
        badge: 'Bounty',
        bountyAmount: '$150',
        status: 'Active',
        category: 'Web',
        icon: '💬',
        iconBg: 'bg-blue-900',
        iconColor: 'text-blue-400',
        submissions: 17,
        likes: [users[0]._id],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
      },
      {
        authorId: users[3]._id,
        title: 'FocusMate - Stay productive together',
        desc: 'A productivity app that connects you with a partner to help you stay focused and get things done.',
        tags: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
        badge: 'Building',
        mockImage: 'focusmate',
        imageBg: 'bg-gradient-to-br from-purple-900 to-black',
        likes: [users[0]._id, users[1]._id],
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000) // 10 hours ago
      },
      {
        authorId: users[5]._id,
        title: 'DevAnalytics',
        desc: 'Open-source analytics dashboard for developers and startups.',
        tags: ['Next.js', 'Tailwind CSS', 'PostgreSQL'],
        badge: 'Building',
        imageBg: 'bg-gradient-to-br from-blue-900 to-black',
        likes: Array(120).fill(null).map((_, i) => users[i % users.length]._id),
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        authorId: users[0]._id,
        title: 'Fix hydration error on dashboard page',
        desc: 'There is a hydration mismatch error on the dashboard when switching theme. Needs investigation and fix.',
        tags: ['Next.js', 'React', 'TypeScript'],
        badge: 'Bounty',
        bountyAmount: '$150',
        status: 'Active',
        category: 'Web',
        icon: 'N',
        iconBg: 'bg-indigo-900',
        iconColor: 'text-indigo-400',
        submissions: 24,
        likes: [users[1]._id, users[2]._id],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        authorId: users[7]._id,
        title: 'Prevent duplicate submissions in forms',
        desc: 'Users can submit the form multiple times rapidly. Add validation or locking to prevent duplicate submissions.',
        tags: ['JavaScript', 'HTML', 'CSS'],
        badge: 'Bounty',
        bountyAmount: '$100',
        status: 'Active',
        category: 'Web',
        icon: 'E',
        iconBg: 'bg-gray-100',
        iconColor: 'text-black',
        submissions: 15,
        likes: [users[0]._id],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        authorId: users[6]._id,
        title: 'Fix slow queries in leaderboard API',
        desc: 'Leaderboard API is taking too long to respond under high load. Optimize the queries and improve performance.',
        tags: ['Node.js', 'MongoDB', 'Express'],
        badge: 'Bounty',
        bountyAmount: '$200',
        status: 'Active',
        category: 'Backend',
        icon: '⚡',
        iconBg: 'bg-emerald-900',
        iconColor: 'text-emerald-400',
        submissions: 32,
        likes: [users[0]._id, users[1]._id],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Posts created');

    // Create comments
    await Comment.create([
      {
        postId: posts[0]._id,
        authorId: users[1]._id,
        content: 'This looks amazing! What database are you using behind the scenes?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        postId: posts[0]._id,
        authorId: users[0]._id,
        content: "Thanks! I'm using PostgreSQL with Prisma.",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        postId: posts[0]._id,
        authorId: users[2]._id,
        content: 'I ran into a small bug on mobile view. The sidebar doesn\'t close properly.',
        isWinner: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ]);

    console.log('Comments created');

    // Create chats
    await Chat.create([
      {
        participants: [users[4]._id, users[0]._id],
        messages: [
          {
            senderId: users[0]._id,
            text: "Hey Arjun! 👋\nI checked out your project DevAnalytics.\nReally impressed with the dashboard UI!",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true
          },
          {
            senderId: users[4]._id,
            text: "Hey Priyanshu! Thanks a lot 🙌\nMeans a lot coming from you!",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true
          },
          {
            senderId: users[0]._id,
            text: "I had a quick question about the charts section.\nWhich library did you use for those?",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true
          },
          {
            senderId: users[4]._id,
            text: "I used Recharts. It's pretty flexible and easy to customize.",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true
          },
          {
            senderId: users[0]._id,
            text: "Great! Thanks for letting me know.\nAlso, I've created a pull request to fix a small UI issue in dark mode.\nLet me know your thoughts!",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: false
          },
          {
            senderId: users[4]._id,
            text: "Hey, thanks for reviewing my project!\nI'll check the PR and merge it.",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: false
          }
        ],
        lastMessage: "Hey, thanks for reviewing my project!...",
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        participants: [users[4]._id, users[6]._id],
        messages: [
          {
            senderId: users[6]._id,
            text: "Yeah, I'll fix that and push the update.",
            time: new Date(Date.now() - 3 * 60 * 60 * 1000),
            isRead: false
          }
        ],
        lastMessage: "Yeah, I'll fix that and push the update.",
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ]);

    console.log('Chats created');
    console.log('✅ Seed data created successfully!');
    console.log('\nTest credentials:');
    console.log('Email: priyanshu@example.com');
    console.log('Password: password123');
    console.log('\nOr use any other user email with the same password');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
