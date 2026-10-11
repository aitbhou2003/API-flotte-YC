const Truck = require("../models/truck.model");
const Remorque = require("../models/remorque.model");
const User = require("../models/user.model");
const Trajet = require("../models/trajet.model");

const conflict = (message) => {
  const error = new Error(message);
  error.statusCode = 409;
  throw error;
};

exports.checkAvailability = async (data, excludeTrajetId = null) => {
  const { camion, remorque, chauffeur, dateDebutPrevue, dateFinPrevue } = data;

  const truck = await Truck.findById(camion);
  if (!truck) {
    const error = new Error("Truck not found");
    error.statusCode = 404;
    throw error;
  }

  if (truck.statut === "en_maintenance") {
    conflict("Truck is under maintenance");
  }

  const trailer = await Remorque.findById(remorque);
  if (!trailer) {
    const error = new Error("Trailer not found");
    error.statusCode = 404;
    throw error;
  }

  if (trailer.statut === "en_maintenance") {
    conflict("Trailer is under maintenance");
  }

  const driver = await User.findById(chauffeur);
  if (!driver) {
    const error = new Error("Driver not found");
    error.statusCode = 404;
    throw error;
  }

  if (driver.role !== "chauffeur") {
    conflict("The assigned user is not a driver");
  }
  if (driver.statue === "suspendu") {
  conflict("A suspended driver cannot be assigned to a trip");
}


  const start = new Date(dateDebutPrevue);
  const end = new Date(dateFinPrevue);

  const overlapFilter = {
    statut: { $in: ["a_faire", "en_cours"] },
    dateDebutPrevue: { $lt: end },
    dateFinPrevue: { $gt: start },
  };

  if (excludeTrajetId) {
    overlapFilter._id = { $ne: excludeTrajetId };
  }

  const truckConflict = await Trajet.exists({
    ...overlapFilter,
    camion,
  });

  if (truckConflict) {
    conflict("Truck is already assigned to an overlapping trip");
  }

  const trailerConflict = await Trajet.exists({
    ...overlapFilter,
    remorque,
  });

  if (trailerConflict) {
    conflict("Trailer is already assigned to an overlapping trip");
  }

  const driverConflict = await Trajet.exists({
    ...overlapFilter,
    chauffeur,
  });

  if (driverConflict) {
    conflict("Driver is already assigned to an overlapping trip");
  }

  return true;
};