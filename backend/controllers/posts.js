const Post = require("../models/post");

// Get all posts
exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  // Structure queries by chaining multiple query methods (.skip, .limit., .then)
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
       * Narrow down the amound documents I retreive for the current page
       *
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
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        totalPosts: count
      });
    })
    .catch(error =>
      res.status(500).json({ message: "Fetching posts failed!" })
    );
};

// Get post
exports.getPost = (req, res, next) => {
  // Find a post based on ID as an argument
  Post.findById(req.params.id)
    .then(post => {
      // If post exist
      if (post) {
        res.status(200).json(post);
      } else {
        // If post does not exist
        res.status(404).json({
          message: "Post not found"
        });
      }
    })
    .catch(error => res.status(500).json({ message: "Fetching post failed!" }));
};

// Add post
exports.addPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  // Save a document (post) to the database
  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error =>
      res.status(500).json({ message: "Creating a post failed!" })
    );
};

// Update post
exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Post updated successfully"
        });
      } else {
        res.status(401).json({
          message: "Not authorized"
        });
      }
    })
    .catch(error => res.status(500).json({ message: "Could not update post" }));
};

// Delete post
exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Deletion successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }
    })
    .catch(error => res.status(500).json({ message: "Deleting post failed!" }));
};
