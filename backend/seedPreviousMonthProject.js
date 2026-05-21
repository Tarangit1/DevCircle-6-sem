import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found to assign the project to.');
      process.exit(1);
    }

    const fortyDaysAgo = new Date();
    fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);

    const postData = {
      title: 'Retro Project Analyzer (Created 40 Days Ago)',
      desc: 'This is a test project to verify the "All Time" vs "This Month" filter. It should ONLY appear in the "All Time" filter on the leaderboard.',
      tags: ['test', 'retro'],
      badge: 'Building',
      authorId: user._id,
      likes: [user._id],
      comments: [],
      bookmarks: [],
      createdAt: fortyDaysAgo,
      updatedAt: fortyDaysAgo,
      __v: 0
    };

    // Use collection.insertOne to bypass Mongoose timestamps middleware
    const result = await Post.collection.insertOne(postData);
    console.log('Successfully created a project from 40 days ago with ID:', result.insertedId);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
