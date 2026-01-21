const messageService = require("../Services/messageService");

/**
 * GET /flats/:id/messages
 * Returns all messages for a flat.
 * Only the flat owner or an admin can access this endpoint.
 */
async function getMessagesForFlat(req, res, next) {
  try {
    const currentUser = req.user;
    const { id: flatId } = req.params;

    const messages = await messageService.getMessagesForFlat(flatId, currentUser);

    return res.json(messages);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /flats/:id/messages/:senderId
 * Returns messages sent by a specific user for a flat.
 * Only the sender or an admin can access this endpoint.
 */
async function getMessagesForFlatAndSender(req, res, next) {
  try {
    const currentUser = req.user;
    const { id: flatId, senderId } = req.params;

    const messages = await messageService.getMessagesForFlatAndSender(
      flatId,
      senderId,
      currentUser
    );

    return res.json(messages);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /flats/:id/messages
 * Any authenticated user can send a message for a flat.
 */
async function createMessage(req, res, next) {
  try {
    const currentUser = req.user;
    const { id: flatId } = req.params;
    const { content } = req.body;

    const message = await messageService.createMessage(flatId, { content }, currentUser);

    return res.status(201).json(message);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getMessagesForFlat,
  getMessagesForFlatAndSender,
  createMessage,
};
