/**
 * Global error-handling middleware.
 * Intercepts thrown errors and ensures consistent JSON responses.
 */
function errorHandler(err, req, res, next) {
  console.error("Error caught by errorHandler:", err);

  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
