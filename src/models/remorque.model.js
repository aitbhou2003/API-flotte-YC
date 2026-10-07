const mongoose = require("mongoose");

const remorqueSchema = new mongoose.Schema(
  {
    immatriculation: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    kilometrageTotal: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    statut: {
      type: String,
      enum: ["disponible", "en_trajet", "en_maintenance"],
      default: "disponible",
    },
  },
  {
    timestamps: true,
  }
);

const Remorque = mongoose.model("Remorque", remorqueSchema);

module.exports = Remorque;