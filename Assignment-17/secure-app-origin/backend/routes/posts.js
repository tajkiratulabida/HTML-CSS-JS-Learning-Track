const express = require("express");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

// ✅ Create post
router.post("/", verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." });
        }

        const newPost = new Post({
            title,
            content,
            author: req.user.id, // Set the logged-in user's ID
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "username");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get a single post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "username");
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update post (Only the owner can update)
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Ensure the logged-in user is the owner of the post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this post." });
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete post (Only the owner can delete)
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Ensure the logged-in user is the owner of the post
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this post." });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
