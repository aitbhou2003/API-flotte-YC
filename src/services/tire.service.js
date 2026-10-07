const Tire = require("../models/tire.model");

exports.createTire = async (data) => {
  return await Tire.create(data);
};

exports.getAllTires = async () => {
  return await Tire.find().populate("camion");
};

exports.getTireById = async (id) => {
  return await Tire.findById(id).populate("camion");
};

exports.updateTire = async (id, data) => {
  return await Tire.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("camion");
};

exports.deleteTire = async (id) => {
  return await Tire.findByIdAndDelete(id);
};