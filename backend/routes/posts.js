var express = require('express')
var router = express.Router();

const Post = require('../models/post');

// Middleware for fetching the data from the database
router.get('', (req, res, next) => {
    // Fetchind data from a post collection
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Post fetched successfully',
            posts: documents
        });
    });
});

// Middleware which will be triggered for incoming POST requests (adding post to the database)
router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post)
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post updated successfully'
        })
    });
})

// Updating posts on the server
router.get('/:id', (req, res, next) => {
     Post.findById(req.params.id)
        .then(post => {
            if(post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: 'Post not found'
                })
            }
        })
});

// Deleting (document) post from the database
router.delete('/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Post deleted!'
            })
        })
});

module.exports = router;