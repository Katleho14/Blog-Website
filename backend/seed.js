// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Blogs } from './schema/BlogSchema.js';
import { Categories } from './schema/CategorySchema.js';
import { Posts } from './schema/PostScgena.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Read data from JSON files
    const blogs = JSON.parse(fs.readFileSync(path.join('data', 'test.blogs.json')));
    const categories = JSON.parse(fs.readFileSync(path.join('data', 'test.categories.json')));
    const posts = JSON.parse(fs.readFileSync(path.join('data', 'test.posts.json')));

    // Clear existing data
    await Blogs.deleteMany();
    await Categories.deleteMany();
    await Posts.deleteMany();

    // Insert new data
    await Blogs.insertMany(blogs);
    await Categories.insertMany(categories);
    await Posts.insertMany(posts);

    console.log('✅ Data successfully seeded!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
