const mongoose = require("mongoose");

const { Schema } = mongoose;

/* Message Schema */
const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    flat: {
      type: Schema.Types.ObjectId,
      ref: "Flat",      // flat that this message is related to
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",      // user who sent the message
      required: true,
    },
  },
  {
    timestamps: true,   // createdAt will represent the message creation date
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
