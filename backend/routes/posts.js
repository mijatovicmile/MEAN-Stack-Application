const express = require("express");

// Import Posts Controller
const PostController = require("../controllers/posts");

// Auth middleware
const checkAuth = require("../middleware/check-auth");

// Multer middleware
const extractFile = require("../middleware/file");

// Express router
const router = express.Router();

// Middleware for fetching the data from the database
router.get("", PostController.getPosts);

// Get single post from the server, based on post id
router.get("/:id", PostController.getPost);

// Middleware which will be triggered for incoming POST requests (adding post to the database)
router.post("", checkAuth, extractFile, PostController.addPost);

// Update the post
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

// Deleting (document) post from the database
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
