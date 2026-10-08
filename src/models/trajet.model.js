const mongoose = require("mongoose");

const trajetSchema = new mongoose.Schema(
  {
    siteDepart: {
      type: String,
      required: true,
      trim: true,
    },

    siteArrivee: {
      type: String,
      required: true,
      trim: true,
    },

    marchandise: {
      type: String,
      required: true,
      trim: true,
    },

    dateDebutPrevue: {
      type: Date,
      required: true,
    },

    dateFinPrevue: {
      type: Date,
      required: true,
    },

    chauffeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },

    remorque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Remorque",
      required: true,
    },

    statut: {
      type: String,
      enum: ["a_faire", "en_cours", "termine"],
      default: "a_faire",
    },

    kilometrageDepart: {
      type: Number,
      min: 0,
    },

    kilometrageArrivee: {
      type: Number,
      min: 0,
    },

    volumeGasoil: {
      type: Number,
      min: 0,
    },

    coutGasoil: {
      type: Number,
      min: 0,
    },

    remarquesVehicule: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Trajet = mongoose.model("Trajet", trajetSchema);

module.exports = Trajet;