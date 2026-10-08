const Maintenance = require("../models/maintenance.model");
const MaintenanceRule = require("../models/maintenanceRule.model");
const Truck = require("../models/truck.model");

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


exports.checkTruckMaintenance = async (truckId) => {
  const truck = await Truck.findById(truckId);

  if (!truck) {
    const error = new Error("Truck not found");
    error.statusCode = 404;
    throw error;
  }

  const rules = await MaintenanceRule.find();

  for (const rule of rules) {
    if (truck.kilometrageTotal >= rule.periodiciteKm) {
      
      const existingMaintenance = await Maintenance.findOne({
        camion: truck._id,
        type: rule.type,
        statut: "alerte_declenchee",
      });

      if (!existingMaintenance) {
        await Maintenance.create({
          camion: truck._id,
          type: rule.type,
          statut: "alerte_declenchee",
          kilometrageAuDeclenchement: truck.kilometrageTotal,
        });
      }

      if (truck.statut !== "en_maintenance") {
        truck.statut = "en_maintenance";
        await truck.save();
      }

      return {
        maintenanceRequired: true,
        message: `Maintenance ${rule.type} required`,
      };
    }
  }

  return {
    maintenanceRequired: false,
    message: "No maintenance required",
  };
};