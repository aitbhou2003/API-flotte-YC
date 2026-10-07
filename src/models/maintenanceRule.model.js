const mongoose = require("mongoose");

const maintenanceRuleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["vidange", "revision", "changement_pneu"],
      required: true,
    },

    periodiciteKm: {
      type: Number,
      required: true,
      min: 1,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MaintenanceRule = mongoose.model(
  "MaintenanceRule",
  maintenanceRuleSchema
);

module.exports = MaintenanceRule;