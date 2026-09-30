const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "chauffeur"],
      require: true,
    },
    statue: {
      type: String,
      enum: ["actif", "suspendu"],
      default : 'actif'
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
