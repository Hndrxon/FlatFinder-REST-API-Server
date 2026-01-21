const mongoose = require("mongoose");

const { Schema } = mongoose;

/* User Schema */
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,     // ensure email uniqueness at DB level
      trim: true,
      lowercase: true,  // normalize stored emails
    },
    passwordHash: {
      type: String,
      required: true,   // store only the hashed password, never plain text
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,        // optional for now, can be required if needed
    },
    isAdmin: {
      type: Boolean,
      default: false,    // admin permissions handled through this flag
    },
    favouriteFlats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Flat",     // reference to Flat documents
      },
    ],
  },
  {
    timestamps: true,    // automatically creates createdAt & updatedAt
  }
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.passwordHash; // hide hashed password on output

  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
