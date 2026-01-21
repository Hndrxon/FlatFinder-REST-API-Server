
const jwt = require("jsonwebtoken");

/**
 * Extracts and verifies a JWT from the Authorization header.
 * If valid, attaches the user payload to req.user.
 * Expected header format: "Authorization: Bearer <token>"
 */
function authenticate(req, res, next) {
// Accept both lowercase and uppercase header variants
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required: missing or invalid Authorization header",
    });
  }

// Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const token = authHeader.split(" ")[1];

  try {
// Verify token using the secret defined in .env (JWT_SECRET)
    const payload = jwt.verify(token, process.env.JWT_SECRET);

// Normalize the payload into a consistent req.user object
    req.user = {
      id: payload.userId,           // internal user ID
      isAdmin: payload.isAdmin === true,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

/**
 * Ensures that the current user is an admin.
 * Must be called AFTER authenticate.
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({
      message: "Admin privileges required",
    });
  }

  return next();
}

module.exports = {
  authenticate,
  requireAdmin,
};
