const { required } = require("joi");
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
    kilometrageTotale: {
      type: String,
      required: true,
      min: 0,
      defaulte: 0,
    },
    statue: {
      type: String,
      enum: ["disponible", "en_trajet", "en_maintenance"],
      defaulte: "disponible",
    },
  },
  {
    timestamps: true,
  },
);

const Truck = mongoose.model("Truck", truckSchema);

module.exports = Truck;
