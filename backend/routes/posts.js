var express = require('express')

// Multer package allows us to extract incoming files 
const multer = require('multer');

const Post = require('../models/post');

var router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

// Define where multer should put files, which it detects in the incoming request
const storage = multer.diskStorage({
    // Destination is a function which will be executed whenever multer tries to save a file
    destination: (req, file, callback) => {
        // Throw and return an error of if detect that file don't have one of these MIME types
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid MIME Type");

        if (isValid) {
            error = null;
        }
        callback(null, "backend/public/images") 
    },
    // Filename 
    filename: (req, file, callback) => {
        const name = file.originalname
          .toLowerCase()
          .split(" ")
          .join("-");
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + extension);
    }
});


// Middleware for fetching the data from the database
router.get('', (req, res, next) => {

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    // If pageSize and currentPage are not undefined (if they are both set and contain valid values)
    if (pageSize && currentPage) {
        /**
         * Construct two different queries 
         * - Fetch all posts 
         * - Adjusted one to only fetch a selected slice of posts for a given page
         */
        postQuery
            /**
             * This means I will not retrieve all posts I find, but I will skip the first "n" posts
             * For example, if I am on page 2, then I want to skip all posts that were displayed on page 1,
             * 
             * Another example: if I am displaying 10 posts per page , I want to skip 10 items because I am on page 2,
             * so I want to skip (10 * (2 - 1)) => 10 items
             */
            .skip(pageSize * (currentPage - 1))
            
            /**
             * Narrow dont the amound documents I retreive for the current page
             * Limits the amount of returned documents
             * 
             * For example: If I got 10 items per page, then I want to limit the query to only
             * return 10 items. 
             */
            .limit(pageSize);
    }

    // Fetchind data from a posts collection
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            // Find and return how many post I have
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: fetchedPosts,
                totalPosts: count
            })
        });
});

// Middleware which will be triggered for incoming POST requests (adding post to the database)
router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/public/images/" + req.file.filename 
    })
    // Save a document (post) to the database
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    });
});

router.put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + "/public/images/" + req.file.filename 
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
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
            if (post) {
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