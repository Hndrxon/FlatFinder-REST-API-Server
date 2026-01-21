// routes/flatRoutes.js
const express = require("express");
const router = express.Router();

// Temporary test route: GET /flats/ping
router.get("/ping", (req, res) => {
  res.json({ message: "Flat routes OK 🏠" });
});

module.exports = router;
