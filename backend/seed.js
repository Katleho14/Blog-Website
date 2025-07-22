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
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

// Recursively convert $oid and $date fields
function cleanMongoDocument(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanMongoDocument);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (key === '$oid') return obj['$oid'];
      if (key === '$date') return new Date(obj['$date']);
      newObj[key] = cleanMongoDocument(obj[key]);
    }
    return newObj;
  }
  return obj;
}

const seedData = async () => {
  try {
    const blogsRaw = JSON.parse(fs.readFileSync(path.join('data', 'test.blogs.json')));
    const categoriesRaw = JSON.parse(fs.readFileSync(path.join('data', 'test.categories.json')));
    const postsRaw = JSON.parse(fs.readFileSync(path.join('data', 'test.posts.json')));

    const blogs = cleanMongoDocument(blogsRaw);
    const categories = cleanMongoDocument(categoriesRaw);
    const posts = cleanMongoDocument(postsRaw);

    await Blogs.deleteMany();
    await Categories.deleteMany();
    await Posts.deleteMany();

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
