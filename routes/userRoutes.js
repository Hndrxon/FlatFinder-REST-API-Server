
const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const { authenticate, requireAdmin } = require("../middleware/authMiddleware");

// Public routes (no authentication required)
router.post("/register", userController.register);
router.post("/login", userController.login);

// All routes below require a valid JWT
router.use(authenticate);

// Admin-only: list all users
router.get("/", requireAdmin, userController.getAllUsers);

// Any authenticated user can get a specific user by ID
router.get("/:id", userController.getUserById);

// Admin or account owner can update/delete
router.patch("/", userController.updateUser);
router.delete("/", userController.deleteUser);

module.exports = router;
