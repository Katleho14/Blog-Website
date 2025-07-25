import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import "dotenv/config";
import BlogRoute from './routes/BlogRoute.js'
import userRoute from './routes/UserRoute.js';
import CategoryRoute from './routes/CategoryRoute.js';
import PostsRoute from './routes/PostsRoute.js'

// configure the server
export const app = express();

// Database connection function
async function connectToDatabase() {
    let isDbConnected = false;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        isDbConnected = true;
    } catch (error) {
        console.error('⚠️  Failed to connect to MongoDB:', error.message);
        console.log('🔄 Running in development mode with mock data');
        isDbConnected = false;
    }
    return isDbConnected;
}

// middleware for json 
app.use(express.json());

// middleware for cors for all origins
app.use(cors({
    origin: [
        'http://localhost:5173',
    ],
}));

// Initialize database connection
let isDbConnected = false;
connectToDatabase().then(connected => {
    isDbConnected = connected;
});

// Export db connection status for controllers to use
export { isDbConnected };

// try {
//     mongoose.connect("mongodb+srv://:@cluster0.kpv00gt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
//     console.log('Connected to MongoDB');
// } catch (error) {
//     console.error('Error connecting to MongoDB:', error.message);
// }

app.use("/users", userRoute);
app.use("/blogs", BlogRoute);
app.use("/categories", CategoryRoute);
app.use("/posts", PostsRoute)

// define the port
app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.APP_PORT || 3000}`);
});

app.get("/", (req, res) => {
    res.send("Server is working");
})

