// Plugin for hashing the user password
const bcrypt = require("bcryptjs");

// Import User model
const User = require("../models/user");

// Json Web Token
const jwt = require("jsonwebtoken");

// Signup
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    // Create a new user
    const user = new User({
      email: req.body.email,
      password: hash
    });
    // Save user to the database
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
};

// Login
exports.login = (req, res, next) => {
  let fetchedUser;
  /**
   * First I want to validate whether the login credentials
   * are valid, but if that's the case, then I want to
   * validate the user
   */

  // Find whether the email address exists
  User.findOne({ email: req.body.email }).then(user => {
    // The user not exists
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    fetchedUser = user;
    // The user with provided email address exist in database
    bcrypt
      .compare(req.body.password, user.password)
      .then(result => {
        // If password sent by the user is not valid
        if (!result) {
          return res.status(401).json({
            message: "Authentication failed"
          });
        }
        /**
         * Password send by the user is valid,
         * then I will create a new JWT token
         */
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        // Sent token as a response to the frontend
        res.status(200).json({
          token: token,
          expiresIn: "3600",
          userId: fetchedUser._id
        });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Authentication failed"
        });
      });
  });
};
