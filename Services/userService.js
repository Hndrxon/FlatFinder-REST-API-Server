const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/* Helper to build consistent HTTP-style errors. */
function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/* Registers a new user. */
async function registerUser({ email, password, firstName, lastName, birthDate, isAdmin = false }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw createError(409, "Email is already registered");
  }

  // Hash password using bcryptjs (cost factor 10 as a common default)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    birthDate: birthDate || undefined,
    isAdmin,
  });

  return user;
}

/**
 * Authenticates a user using email and password.
 * Returns the user (without passwordHash via toJSON) and a signed JWT.
 */
async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw createError(401, "Invalid email or password");
  }

  // Payload MUST match what authMiddleware expects
  const payload = {
    userId: user._id.toString(),
    isAdmin: user.isAdmin === true,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { user, token };
}

/**
 * Returns all users.
 * Authorization should be enforced at the controller/middleware level (e.g. requireAdmin).
 */
async function getAllUsers() {
  const users = await User.find();
  return users;
}

/* Returns a single user by ID. */
async function getUserById(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw createError(404, "User not found");
  }

  return user;
}

/*
 * Updates a user profile.
 * The controller must ensure that only the account owner or an admin calls this function.
 */
async function updateUser(userId, updates) {
  const allowedFields = ["firstName", "lastName", "birthDate"];
  const updateData = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true } // return the updated document
  );

  if (!updatedUser) {
    throw createError(404, "User not found");
  }

  return updatedUser;
}

/**
 * Deletes a user account by ID.
 * Authorization (admin or account owner) must be handled in the controller.
 */
async function deleteUser(userId) {
  const deleted = await User.findByIdAndDelete(userId);

  if (!deleted) {
    throw createError(404, "User not found");
  }

  return;
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
