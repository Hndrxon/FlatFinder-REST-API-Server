const userService = require("../Services/userService");

/* creates a new user. */
async function register(req, res, next) {
  try {
    const { email, password, firstName, lastName, birthDate, isAdmin } = req.body;

    const user = await userService.registerUser({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      isAdmin,
    });

    // 201 = Created
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}

/* authenticates a user and returns a JWT. */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { user, token } = await userService.loginUser({ email, password });

    return res.json({
      token,
      user,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /users
 * Admin-only: list all users.
*/
async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /users/:id
 * Any authenticated user can view a specific user by ID.
 */
async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /users
 * Updates user profile.
 * - If admin: can update any user by passing userId in the body.
 * - If normal user: can only update their own profile.
 */
async function updateUser(req, res, next) {
  try {
    const currentUser = req.user;

    if (!currentUser || !currentUser.id) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      throw error;
    }

    const { userId, firstName, lastName, birthDate } = req.body;

    let targetUserId = currentUser.id;

    // Admin can update any user if an explicit userId is provided
    if (currentUser.isAdmin === true && userId) {
      targetUserId = userId;
    }

    const updated = await userService.updateUser(targetUserId, {
      firstName,
      lastName,
      birthDate,
    });

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /users
 * Deletes a user.
 * - If admin: can delete any user by passing userId in the body.
 * - If normal user: can only delete their own account.
 */
async function deleteUser(req, res, next) {
  try {
    const currentUser = req.user;

    if (!currentUser || !currentUser.id) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      throw error;
    }

    const { userId } = req.body;

    let targetUserId = currentUser.id;

    // Admin can delete any user if an explicit userId is provided
    if (currentUser.isAdmin === true && userId) {
      targetUserId = userId;
    }

    await userService.deleteUser(targetUserId);

    // 204 = No Content
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
