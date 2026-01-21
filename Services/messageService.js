const Message = require("../models/messageModel");
const Flat = require("../models/flatModel");

/* Helper to build consistent HTTP-style errors. */
function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/**
 * Returns all messages for a given flat.
 * Only the flat owner or an admin is allowed to see all messages.
 */
async function getMessagesForFlat(flatId, currentUser) {
  if (!currentUser || !currentUser.id) {
    throw createError(401, "Authentication required");
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    throw createError(404, "Flat not found");
  }

  const isOwner = flat.owner.toString() === currentUser.id;
  const isAdmin = currentUser.isAdmin === true;

  if (!isOwner && !isAdmin) {
    throw createError(403, "Only the flat owner or an admin can view all messages for this flat");
  }

  const messages = await Message.find({ flat: flatId }).sort({ createdAt: 1 });

  return messages;
}

/**
 * Returns messages for a given flat and a specific sender.
 * Only the sender (or an admin) is allowed to see these messages.
 */
async function getMessagesForFlatAndSender(flatId, senderId, currentUser) {
  if (!currentUser || !currentUser.id) {
    throw createError(401, "Authentication required");
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    throw createError(404, "Flat not found");
  }

  const isSender = currentUser.id === senderId.toString();
  const isAdmin = currentUser.isAdmin === true;

  if (!isSender && !isAdmin) {
    throw createError(403, "Only the sender or an admin can view these messages");
  }

  const messages = await Message.find({
    flat: flatId,
    sender: senderId,
  }).sort({ createdAt: 1 });

  return messages;
}

/**
 * Creates a new message related to a specific flat.
 * Any authenticated user can send a message.
 */
async function createMessage(flatId, { content }, currentUser) {
  if (!currentUser || !currentUser.id) {
    throw createError(401, "Authentication required");
  }

  if (!content || !content.trim()) {
    throw createError(400, "Message content is required");
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    throw createError(404, "Flat not found");
  }

  const message = await Message.create({
    content: content.trim(),
    flat: flatId,
    sender: currentUser.id,
  });

  return message;
}

module.exports = {
  getMessagesForFlat,
  getMessagesForFlatAndSender,
  createMessage,
};
