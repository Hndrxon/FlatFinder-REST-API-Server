const flatService = require("../Services/flatService");

/* GET all flats(obvious) */
async function getAllFlats(req, res, next) {
  try {
    const flats = await flatService.getAllFlats();
    return res.json(flats);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /flats/:id
 * Any authenticated user can view a flat by ID.
 */
async function getFlatById(req, res, next) {
  try {
    const { id } = req.params;

    const flat = await flatService.getFlatById(id);
    return res.json(flat);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /flats
 * Creates a new flat owned by the current user.
 */
async function createFlat(req, res, next) {
  try {
    const currentUser = req.user;

    const {
      city,
      streetName,
      streetNumber,
      areaSize,
      hasAC,
      yearBuilt,
      rentPrice,
      dateAvailable,
    } = req.body;

    const flat = await flatService.createFlat(
      {
        city,
        streetName,
        streetNumber,
        areaSize,
        hasAC,
        yearBuilt,
        rentPrice,
        dateAvailable,
      },
      currentUser
    );

    return res.status(201).json(flat);
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /flats
 * Updates a flat.
 * The flatId is expected in the request body.
 * Only the flat owner or an admin can perform this action.
 */
async function updateFlat(req, res, next) {
  try {
    const currentUser = req.user;
    const { flatId, ...updateFields } = req.body;

    if (!flatId) {
      const error = new Error("flatId is required to update a flat");
      error.statusCode = 400;
      throw error;
    }

    const updatedFlat = await flatService.updateFlat(flatId, updateFields, currentUser);

    return res.json(updatedFlat);
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /flats
 * Deletes a flat.
 * The flatId is expected in the request body.
 * Only the flat owner or an admin can perform this action.
 */
async function deleteFlat(req, res, next) {
  try {
    const currentUser = req.user;
    const { flatId } = req.body;

    if (!flatId) {
      const error = new Error("flatId is required to delete a flat");
      error.statusCode = 400;
      throw error;
    }

    await flatService.deleteFlat(flatId, currentUser);

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAllFlats,
  getFlatById,
  createFlat,
  updateFlat,
  deleteFlat,
};
