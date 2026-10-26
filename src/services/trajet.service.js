const Trajet = require("../models/trajet.model");
const Truck = require("../models/truck.model");
const Remorque = require("../models/remorque.model"); 
const availabilityService = require("./availability.service");
const maintenanceService = require("./maintenance.service");

  

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
  const currentTrajet =  await Trajet.findById(id);
  if (!currentTrajet) {
    const error = new Error("Trajet introuvable");
    error.statusCode = 404;
    throw error;
  }

  const mergedata = {
    camion: data.camion || currentTrajet.camion,
    remorque: data.remorque || currentTrajet.remorque,
    chauffeur: data.chauffeur || currentTrajet.chauffeur,
    dateDebutPrevue: data.dateDebutPrevue || currentTrajet.dateDebutPrevue,
    dateFinPrevue: data.dateFinPrevue || currentTrajet.dateFinPrevue,
  };

  await availabilityService.checkAvailability(mergedata,id)

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

exports.getTrajetsByChauffeur = async (chauffeurId) => {
  return await Trajet.find({ chauffeur: chauffeurId })
    .populate("camion")
    .populate("remorque")
    .sort({ dateDebutPrevue: 1 });
};

exports.demarrerTrajet = async (trajetId, chauffeurId, kilometrageDepart) => {
  const trajet = await Trajet.findOne({
    _id: trajetId,
    chauffeur: chauffeurId,
  });

  if (!trajet) {
    const error = new Error(
      "Trajet introuvable ou non attribué à ce chauffeur",
    );
    error.statusCode = 404;
    throw error;
  }

  if (trajet.statut !== "a_faire") {
    const error = new Error("Seul un trajet à faire peut être démarré");
    error.statusCode = 409;
    throw error;
  }

  const camion = await Truck.findById(trajet.camion);

  if (!camion) {
    const error = new Error("Camion introuvable");
    error.statusCode = 404;
    throw error;
  }

  if (camion.statut === "en_maintenance") {
    const error = new Error(
      "Impossible de démarrer : le camion est en maintenance",
    );
    error.statusCode = 409;
    throw error;
  }

  if (kilometrageDepart < camion.kilometrageTotal) {
    const error = new Error(
      `Le kilométrage de départ ne peut pas être inférieur au kilométrage actuel du camion`,
    );
    error.statusCode = 400;
    throw error;
  }

  trajet.kilometrageDepart = kilometrageDepart;
  trajet.statut = "en_cours";

  await trajet.save();

  camion.statut = "en_trajet";
  await camion.save();
  if (trajet.remorque) {
    await Remorque.findByIdAndUpdate(trajet.remorque, { statut: "en_trajet" });
  }

  return trajet;
};

exports.terminerTrajet = async (trajetId, chauffeurId, data) => {
  const trajet = await Trajet.findOne({
    _id: trajetId,
    chauffeur: chauffeurId,
  });

  if (!trajet) {
    const error = new Error(
      "Trajet introuvable ou non attribué à ce chauffeur",
    );
    error.statusCode = 404;
    throw error;
  }

  if (trajet.statut !== "en_cours") {
    const error = new Error("Seul un trajet en cours peut être terminé");
    error.statusCode = 409;
    throw error;
  }

  if (trajet.kilometrageDepart === undefined) {
    const error = new Error("Le kilométrage de départ est manquant");
    error.statusCode = 400;
    throw error;
  }

  if (data.kilometrageArrivee <= trajet.kilometrageDepart) {
    const error = new Error(
      "Le kilométrage d'arrivée doit être supérieur au kilométrage de départ",
    );
    error.statusCode = 400;
    throw error;
  }

  const camion = await Truck.findById(trajet.camion);

  if (!camion) {
    const error = new Error("Camion introuvable");
    error.statusCode = 404;
    throw error;
  }

  trajet.kilometrageArrivee = data.kilometrageArrivee;
  trajet.volumeGasoil = data.volumeGasoil;
  trajet.coutGasoil = data.coutGasoil;
  trajet.remarquesVehicule = data.remarquesVehicule;
  trajet.statut = "termine";

  await trajet.save();

  camion.kilometrageTotal = data.kilometrageArrivee;
  camion.statut = "disponible";
  await camion.save();

  const distanceParcourue = data.kilometrageArrivee - trajet.kilometrageDepart;

  if (trajet.remorque) {
    const remorque = await Remorque.findById(trajet.remorque);
    if (remorque) {
      remorque.kilometrageTotal = (remorque.kilometrageTotal || 0) + distanceParcourue;
      remorque.statut = "disponible";
      await remorque.save();
    }
  }

  await maintenanceService.checkTruckMaintenance(camion._id);

  const consommationMoyenne =
    data.volumeGasoil > 0 && distanceParcourue > 0
      ? Number(((data.volumeGasoil / distanceParcourue) * 100).toFixed(2))
      : null;

  return {
    trajet,
    distanceParcourue,
    consommationMoyenne,
  };
};
