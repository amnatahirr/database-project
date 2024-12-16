const jwt = require("jsonwebtoken");

// Middleware to authenticate access tokens
exports.authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json({ message: "Access token expired or invalid" });

      req.user = user; // Attach user data to request
      next();
    });
  } else {
    res.status(401).json({ message: "Access token required" });
  }
};

// Middleware to verify refresh tokens
exports.verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(403).json({ message: "Refresh token required" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired refresh token" });

    req.user = user; // Attach user data to request
    next();
  });
};
