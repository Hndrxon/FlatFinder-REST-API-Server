const mongoose = require("mongoose");

const { Schema } = mongoose;

/* Flat Schema */
const flatSchema = new Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    streetName: {
      type: String,
      required: true,
      trim: true,
    },
    streetNumber: {
      type: String,
      required: true, // keep as string to support numbers like "12B"
      trim: true,
    },
    areaSize: {
      type: Number,
      required: true,  // size in square meters (or another consistent unit)
      min: 0,
    },
    hasAC: {
      type: Boolean,
      required: true,
    },
    yearBuilt: {
      type: Number,
      required: true,
      min: 1800,       // basic validation to avoid unrealistic years
    },
    rentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    dateAvailable: {
      type: Date,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",      // references the User who created / owns this flat
      required: true,
    },
  },
  {
    timestamps: true,   // createdAt and updatedAt for auditing
  }
);

const Flat = mongoose.model("Flat", flatSchema);

module.exports = Flat;
