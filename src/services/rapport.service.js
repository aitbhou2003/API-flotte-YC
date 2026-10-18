const Trajet = require("../models/trajet.model");
const Truck = require("../models/truck.model");
const Maintenance = require("../models/maintenance.model");


exports.getRapportConsommation = async () => {
  const data = await Trajet.aggregate([
    {
      $match: {
        statut: "termine",
        volumeGasoil: { $exists: true, $gt: 0 },
        kilometrageDepart: { $exists: true },
        kilometrageArrivee: { $exists: true },
      },
    },

    {
      $group: {
        _id: "$camion",
        totalVolumeGasoil: { $sum: "$volumeGasoil" },
        totalCoutGasoil: { $sum: "$coutGasoil" },
        totalDistance: {
          $sum: { $subtract: ["$kilometrageArrivee", "$kilometrageDepart"] },
        },
        nombreTrajets: { $sum: 1 },
      },
    },

    {
      $addFields: {
        consommationMoyenne: {
          $cond: [
            { $gt: ["$totalDistance", 0] },
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$totalVolumeGasoil", "$totalDistance"] },
                    100,
                  ],
                },
                2,
              ],
            },
            null,
          ],
        },
      },
    },

    {
      $lookup: {
        from: "trucks",
        localField: "_id",
        foreignField: "_id",
        as: "camion",
      },
    },
    { $unwind: "$camion" },

    {
      $project: {
        _id: 0,
        camionId: "$camion._id",
        immatriculation: "$camion.immatriculation",
        marque: "$camion.marque",
        nombreTrajets: 1,
        totalDistanceKm: "$totalDistance",
        totalVolumeGasoilLitres: "$totalVolumeGasoil",
        totalCoutGasoilDH: "$totalCoutGasoil",
        consommationMoyenneL100km: "$consommationMoyenne",
      },
    },
    { $sort: { consommationMoyenneL100km: -1 } },
  ]);

  return data;
};


exports.getRapportKilometrage = async () => {
  const trucks = await Truck.find()
    .select("immatriculation marque kilometrageTotal statut")
    .sort({ kilometrageTotal: -1 });

  return trucks;
};


exports.getRapportAlertesMaintenance = async () => {
  const alertes = await Maintenance.find({ statut: "alerte_declenchee" })
    .populate("camion", "immatriculation marque kilometrageTotal")
    .populate("remorque", "immatriculation type")
    .populate("pneu", "position kilometrageUsure")
    .sort({ dateDeclenchement: -1 });

  return {
    totalAlertes: alertes.length,
    alertes,
  };
};