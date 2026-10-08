const Maintenance = require("../models/maintenance.model");

exports.createMaintenance = async (data) => {
  return await Maintenance.create(data);
};

exports.getAllMaintenances = async () => {
  return await Maintenance.find()
    .populate("camion")
    .populate("remorque")
    .populate("pneu");
};

exports.getMaintenanceById = async (id) => {
  return await Maintenance.findById(id)
    .populate("camion")
    .populate("remorque")
    .populate("pneu");
};

exports.updateMaintenance = async (id, data) => {
  return await Maintenance.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("camion")
    .populate("remorque")
    .populate("pneu");
};

exports.deleteMaintenance = async (id) => {
  return await Maintenance.findByIdAndDelete(id);
};