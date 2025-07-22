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

// middleware for json 
app.use(express.json());

// middleware for cors for all origins
app.use(cors({
    origin: [
        'http://localhost:5173',
    ],
}));

// connect to the database
try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
}

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
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});

// app.listen(3000, () => {
//     console.log(`Server is running on port 3000`);
// });

app.get("/", (req, res) => {
    res.send("Server is working");
})

