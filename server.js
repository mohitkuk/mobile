// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Create an Express app
const app = express();
const PORT = 3000;

// Connect to MongoDB and insert sample data
mongoose.connect('mongodb+srv://user123:User123@cluster0.qihvefj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        // Define Mongoose schema and models for posts and users

        // Define schema for posts
        const postSchema = new mongoose.Schema({
            postId: Number,
            userData: {
                userId: Number,
                Name: String,
                Location: String
            },
            creationTime: Number,
            postText: String
        });

        // Define model for posts
        const Post = mongoose.model('Post', postSchema);

        // Define schema for users
        const userSchema = new mongoose.Schema({
            userId: Number,
            Name: String,
            Location: String
        });

        // Define model for users
        const User = mongoose.model('User', userSchema);

        // Sample JSON data for posts
        const postData = [
            {
                postId: 1,
                userData: {
                    userId: 1,
                    Name: 'John Doe',
                    Location: 'Barrie, Ontario'
                },
                creationTime: 71020221200,
                postText: 'Sample post text 1'
            },
            {
                postId: 2,
                userData: {
                    userId: 2,
                    Name: 'Jane Smith',
                    Location: 'Toronto, Ontario'
                },
                creationTime: 71020221210,
                postText: 'Sample post text 2'
            }
        ];

        // Sample JSON data for users
        const userData = [
            {
                userId: 1,
                Name: 'John Doe',
                Location: 'Barrie, Ontario'
            },
            {
                userId: 2,
                Name: 'Jane Smith',
                Location: 'Toronto, Ontario'
            }
        ];

        // Insert sample data into MongoDB
        await Post.insertMany(postData);
        await User.insertMany(userData);
        console.log('Sample data inserted successfully');

        // REST API endpoints

        // Get all posts (creation time, ID, and post text)
        app.get('/posts', async (req, res) => {
            const posts = await Post.find({}, { creationTime: 1, postId: 1, postText: 1 });
            res.json(posts);
        });

        // Get all known Facebook users mentioned in the JSON
        app.get('/users', async (req, res) => {
            const users = await User.find();
            res.json(users);
        });

        // Get all posts grouped by location mentioned in the JSON
        app.get('/posts/groupedByLocation', async (req, res) => {
            const postsByLocation = await Post.aggregate([
                { $group: { _id: "$userData.Location", posts: { $push: "$$ROOT" } } }
            ]);
            res.json(postsByLocation);
        });

        // Get the details about a post (given the post ID)
        app.get('/posts/:postId', async (req, res) => {
            const postId = parseInt(req.params.postId);
            const post = await Post.findOne({ postId });
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(post);
        });

        // Get detailed profile information about a given Facebook user (given the user’s screen name)
        app.get('/users/:userName', async (req, res) => {
            const userName = req.params.userName;
            const user = await User.findOne({ Name: userName });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
    

// Serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
