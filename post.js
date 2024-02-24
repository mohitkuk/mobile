const mongoose = require('mongoose');

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

const Post = mongoose.model('Post', postSchema);
