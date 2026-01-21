const express = require("express");
const router = express.Router();
const messageController = require("../Controller/messageController");
const { authenticate } = require("../middleware/authMiddleware");

// All message routes require a valid JWT
router.use(authenticate);

router.get("/:id/messages", messageController.getMessagesForFlat);

router.get("/:id/messages/:senderId", messageController.getMessagesForFlatAndSender);

router.post("/:id/messages", messageController.createMessage);

module.exports = router;
