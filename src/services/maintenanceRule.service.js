const MaintenanceRule = require("../models/maintenanceRule.model");

exports.createMaintenanceRule = async (data) => {
  return await MaintenanceRule.create(data);
};

exports.getAllMaintenanceRules = async () => {
  return await MaintenanceRule.find();
};

exports.getMaintenanceRuleById = async (id) => {
  return await MaintenanceRule.findById(id);
};

exports.updateMaintenanceRule = async (id, data) => {
  return await MaintenanceRule.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

exports.deleteMaintenanceRule = async (id) => {
  return await MaintenanceRule.findByIdAndDelete(id);
};