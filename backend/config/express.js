// Include flexible Node.js web application framework that provides a robust set of features for our application
const express = require("express");

// Provides utilities for working with file and directory paths
const path = require("path");

// Parse incoming request bodies in a middleware before our handlers available under the req.body property
const bodyParser = require("body-parser");

// Import Post Route
const postsRoute = require("../routes/posts");

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
 * Serve static image files from public/images folder
 * use the express.static built-in middleware function in Express.
 */
app.use("/public/images", express.static(path.join("backend/public/images")));

// CORS (Cross-Origin Resource Sharing) middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoute);

// Exports the application module
module.exports = app;
