// Include flexible Node.js web application framework that provides a robust set of features for our application
const express = require("express");

// Provides utilities for working with file and directory paths
const path = require("path");

// Parse incoming request bodies in a middleware before our handlers available under the req.body property
const bodyParser = require("body-parser");

// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require("mongoose");

// Import Posts Routes
const postsRoute = require("./routes/posts");

// Import User authentication Routes
const userRoutes = require("./routes/user");

// Create an Express application and store it in a constant named app, by running express() as a function
const app = express();

// Connecting to MongoDB
mongoose
  .connect(
    "mongodb+srv://Mile:" +
      process.env.MONGO_ATLAS_PASSWORD +
      "@cluster-i2ivt.mongodb.net/posts?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  // Connection to database is successfully
  .then(() => {
    console.log("Successfully connected to database");
  })
  // Catch and log any potential error we might have
  .catch(err => {
    console.log("Connection to database failed", +err);
  });

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
 * Serve static image files from /images folder
 * use the express.static built-in middleware function in Express.
 */
app.use("/images", express.static(path.join(__dirname, "images")));

// CORS (Cross-Origin Resource Sharing) middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// Posts Routes in my application
app.use("/api/posts", postsRoute);

// User authentication routes in my application
app.use("/api/user", userRoutes);

// Exports the application module
module.exports = app;
