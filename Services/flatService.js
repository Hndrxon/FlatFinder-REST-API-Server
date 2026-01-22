const Flat = require("../models/flatModel");
const { updateUser } = require("./userService");

function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/**
 * Returns all flats.
 * Any authenticated user can list flats.
 */
async function getAllFlats() {
  const flats = await Flat.find();
  return flats;
}

/**
 * Returns a single flat by ID.
 * Any authenticated user can view a flat.
 */
async function getFlatById(flatId) {
  const flat = await Flat.findById(flatId);

  if (!flat) {
    throw createError(404, "Flat not found");
  }

  return flat;
}

/**
 * Creates a new flat owned by the current user.
 * - currentUser.id is used as the owner field.
 */
async function createFlat(flatData, currentUser) {
  if (!currentUser || !currentUser.id) {
    throw createError(401, "Authentication required");
  }

  const flat = await Flat.create({
    ...flatData,
    owner: currentUser.id,
  });

  return flat;
}

/**
 * Updates a flat.
 * Only the flat owner or an admin is allowed to update.
 *
 * @param {string} flatId        - ID do flat a ser atualizado
 * @param {object} updates       - Campos a atualizar
 * @param {object} currentUser   - { id, isAdmin } vindo do authMiddleware
 */
async function updateFlat(flatId, updates, currentUser) {
  if (!currentUser || !currentUser.id) {
    throw createError(401, "Authentication required");
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    throw createError(404, "Flat not found");
  }

  const isOwner = flat.owner.toString() === currentUser.id;
  const isAdmin = currentUser.isAdmin === true;

  // only the owner or an admin can update(reinforced)
  if (!isOwner && !isAdmin) {
    throw createError(
      403,
      "Only the flat owner or an admin can update this flat"
    );
  }

  const allowedFields = [
    "city",
    "streetName",
    "streetNumber",
    "areaSize",
    "hasAC",
    "yearBuilt",
    "rentPrice",
    "dateAvailable",
  ];

  const updateData = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  }

  const updatedFlat = await Flat.findByIdAndUpdate(flatId, updateData, {
    new: true,
  });

  if (!updatedFlat) {
    throw createError(404, "Flat not found");
  }

  return updatedFlat;
}

/**
 * Deletes a flat.
 * Only the flat owner or an admin is allowed to delete.
 */
async function deleteFlat(flatId, currentUser) {
  if (!currentUser || !currentUser.id) {
    throw createError(401, "Authentication required");
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    throw createError(404, "Flat not found");
  }

  const isOwner = flat.owner.toString() === currentUser.id;
  const isAdmin = currentUser.isAdmin === true;

  // only the owner or an admin can delete(reinforced)
  if (!isOwner && !isAdmin) {
    throw createError(
      403,
      "Only the flat owner or an admin can delete this flat"
    );
  }

  await Flat.findByIdAndDelete(flatId);
  return;
}

module.exports = {
  getAllFlats,
  getFlatById,
  createFlat,
  updateFlat,
  deleteFlat,
  updateUser,
};
