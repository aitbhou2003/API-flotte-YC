const Trajet = require("../models/trajet.model");
const availabilityService = require("./availability.service");

exports.createTrajet = async (data) => {
  await availabilityService.checkAvailability(data);
  return await Trajet.create(data);
};

exports.getAllTrajets = async () => {
  return await Trajet.find()
    .populate("chauffeur", "-password")
    .populate("camion")
    .populate("remorque");
};

exports.getTrajetById = async (id) => {
  return await Trajet.findById(id)
    .populate("chauffeur", "-password")
    .populate("camion")
    .populate("remorque");
};

exports.updateTrajet = async (id, data) => {
  return await Trajet.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("chauffeur", "-password")
    .populate("camion")
    .populate("remorque");
};

exports.deleteTrajet = async (id) => {
  return await Trajet.findByIdAndDelete(id);
};