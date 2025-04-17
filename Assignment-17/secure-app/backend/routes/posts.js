const express = require("express");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    // Extract token from "Bearer <token>
    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Create post (Prevents XSS & NoSQL Injection)
router.post(
    "/",
    verifyToken,
    [
        body("title").trim().isLength({ min: 3 }).escape(),
        body("content").trim().isLength({ min: 10 }).escape()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { title, content } = req.body;

            // Prevent NoSQL Injection by disallowing `$` and `.`
            if (/\$|\./.test(title) || /\$|\./.test(content)) {
                return res.status(400).json({ message: "Invalid characters detected." });
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
    }
);

// Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "username");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single post
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

//  Update post (Only the owner can update)
router.put(
    "/:id",
    verifyToken,
    [
        body("title").optional().trim().isLength({ min: 3 }).escape(),
        body("content").optional().trim().isLength({ min: 10 }).escape()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: "Post not found." });
            }

            // Ensure the logged-in user is the owner of the post
            if (post.author.toString() !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to update this post." });
            }

            // Prevent NoSQL Injection
            const updateData = {};
            if (req.body.title) updateData.title = req.body.title;
            if (req.body.content) updateData.content = req.body.content;

            const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
            res.json(updatedPost);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Delete post (Only the owner can delete)
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
