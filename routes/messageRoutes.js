// routes/messageRoutes.js
const express = require("express");
const router = express.Router();

// Temporary test route: GET /flats/:id/messages/ping
router.get("/:id/messages/ping", (req, res) => {
  res.json({
    flatId: req.params.id,
    message: "Message routes OK 💬",
  });
});

module.exports = router;
