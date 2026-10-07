const Truck = require("../models/truck.model");

exports.createTruck = async (data) => {
  return await Truck.create(data);
};

exports.getAllTrucks = async () => {
  return await Truck.find();
};

exports.getTruckById = async (id) => {
  return await Truck.findById(id);
};

exports.updateTruck = async (id, data) => {
  return await Truck.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

exports.deleteTruck = async (id) => {
  return await Truck.findByIdAndDelete(id);
};