const Truck = require("../models/truck.model");

exports.createTruck = async (data) => {
  const truck = await Truck.create(data);

  return truck;
};

exports.getAllTrucks = async () => {
  const truks = Truck.find();
  return truks;
};

exports.getTruckById = async (id) => {
  const truck = Truck.find(id);
  return truck;
};

exports.updateTruck = async (id, data) => {
  return await Truck.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteTruck = async (id) => {
  return await Truck.findByIdAndDelete(id);
};
