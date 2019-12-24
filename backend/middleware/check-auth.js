/**
 * Middleware for checking if the user
 * is authenticated or not
 */
const jwt = require("jsonwebtoken");

// Middleware is just a function which gets executed on the incoming request
module.exports = (req, res, next) => {
  /**
   * 1. Check if we have a token attached to our request
   * 2. Validate token (verify an incoming token)
   */
  try {
    const token = req.headers.authorization.split(" ")[1];
    // If we have a valid token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    // We don't have a token and we are not authenticated
    res.status(401).json({
      message: "You are not authenticated!"
    });
  }
};
