// Include flexible Node.js web application framework that provides a robust set of features for our application
const express = require('express');

// Provides utilities for working with file and directory paths
const path = require('path');

// Parse incoming request bodies in a middleware before our handlers available under the req.body property
const bodyParser = require('body-parser');

// Import Post database model 
const Post = require('../models/post');

// Create an Express application and store it in a constant named app, by running express() as a function
const app = express();

// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option
app.use(bodyParser.json());

/**
 * Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type 
 * header matches the type option.
 * 
 * The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) 
 * or the qs library (when true). 
 * 
 * The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, 
 * allowing for a JSON-like experience with URL-encoded
 */
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Serve static files such as images, CSS files, and JavaScript files,
 * use the express.static built-in middleware function in Express.
 */
app.use(express.static(path.join(__dirname, 'public')));


// CORS (Cross-Origin Resource Sharing) middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

// Middleware for fetching the data from the database
app.get('/api/posts', (req, res, next) => {
    // Fetchind data from a post collection
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Post fetched successfully',
            posts: documents
        });
    });
});

// Middleware which will be triggered for incoming POST requests (adding post to the database)
app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    // Save a document (post) to the database
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id
        });
    });
});

// Deleting (document) post from the database
app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Post deleted!'
            })
        })
});

// Exports the application module
module.exports = app;