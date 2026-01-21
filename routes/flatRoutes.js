const express = require("express");
const router = express.Router();
const flatController = require("../Controller/flatController");
const { authenticate } = require("../middleware/authMiddleware");

// All flat routes require a valid JWT
router.use(authenticate);

// List all flats
router.get("/", flatController.getAllFlats);

// Get a single flat by ID
router.get("/:id", flatController.getFlatById);

// Create a new flat (current user becomes the owner)
router.post("/", flatController.createFlat);

// Update an existing flat (flatId in request body)
router.patch("/", flatController.updateFlat);

// Delete a flat (flatId in request body)
router.delete("/", flatController.deleteFlat);

module.exports = router;
