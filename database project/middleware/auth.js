const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    let token;

    // Retrieve the token from the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with "Bearer"
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // Extract the token part from "Bearer <token>"
    }

    // If no token is found, deny access
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      // Log the decoded user to check the structure
      console.log("Decoded user:", decoded);

      // Attach the verified user information to req.user
      req.user = decoded;
      next(); // Pass control to the next middleware
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
