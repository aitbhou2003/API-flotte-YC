const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema(
  {
    immatriculation: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    marque: {
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

const Truck = mongoose.model("Truck", truckSchema);

module.exports = Truck;