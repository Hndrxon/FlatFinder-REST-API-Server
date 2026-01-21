// routes/userRoutes.js
const express = require("express");
const router = express.Router();

// Temporary test route: GET /users/ping
router.get("/ping", (req, res) => {
  res.json({ message: "User routes OK 👌" });
});

module.exports = router;
