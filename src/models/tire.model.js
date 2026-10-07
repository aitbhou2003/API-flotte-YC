const mongoose = require("mongoose");

const tireSchema = new mongoose.Schema(
  {
    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    kilometrageUsure: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Tire = mongoose.model("Tire", tireSchema);

module.exports = Tire;