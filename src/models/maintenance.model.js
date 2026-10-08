const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
    },

    remorque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Remorque",
    },

    pneu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tire",
    },

    type: {
      type: String,
      enum: ["vidange", "revision", "changement_pneu"],
      required: true,
    },

    statut: {
      type: String,
      enum: ["alerte_declenchee", "resolue"],
      default: "alerte_declenchee",
    },

    kilometrageAuDeclenchement: {
      type: Number,
      required: true,
      min: 0,
    },

    dateDeclenchement: {
      type: Date,
      default: Date.now,
    },

    dateResolution: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

module.exports = Maintenance;