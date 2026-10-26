const Trajet = require("../models/trajet.model");
const Tire = require("../models/tire.model");
const Truck = require("../models/truck.model");
const { any } = require("joi");

exports.getEcoPerformance = async () => {
  const result = await Trajet.aggregate([
    {
      $match: {
        statut: "termine",
      },
    },
    {
      $group: {
        _id: "$chauffeur",
        totalGasoil: { $sum: "$volumeGasoil" },
        totalDistance: {
          $sum: { $subtract: ["$kilometrageArrivee", "$kilometrageDepart"] },
        },
      },
    },
    {
      $match: {
        totalDistance: { $gt: 0 },
      },
    },
    {
      $addFields: {
        consommationMoyenne: {
          $multiply: [{ $divide: ["$totalGasoil", "$totalDistance"] }, 100],
        },
      },
    },
    {
      $addFields: {
        scoreComposite: {
          $max: [
            0,
            {
              $min: [
                100,
                {
                  $subtract: [
                    100,
                    {
                      $multiply: [
                        { $subtract: ["$consommationMoyenne", 30] },
                        2.5,
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },

    {
      $project: {
        _id: 0,
        chauffeurId: "$_id",
        totalDistance: "$totalDistance",
        totalGasoil: "$totalGasoil",
        consommationMoyenne: "$consommationMoyenne",
        scoreComposite: "$scoreComposite",
      },
    },
    {
      $sort: { scoreComposite: -1 },
    },
  ]);

  return result;
};

exports.getTiresHealthMatrix = async () => {
  const result = await Tire.aggregate([
    {
      $match: {
        isArchived: { $ne: true },
        statut: { $ne: "remplace" },
      },
    },
    {
      $addFields: {
        remainingKm: {
          $max: [
            0,
            {
              $subtract: [
                { $ifNull: ["$seuilKm", 80000] },
                "$kilometrageUsure",
              ],
            },
          ],
        },
      },
    },
    {
      $addFields: {
        isCritical: {
          $or: [
            { $lt: ["$remainingKm", 5000] },
            { $lte: ["$profondeurSculpture", 3] },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$position",
        nombrePneus: { $sum: 1 },
        kilometrageMoyen: { $avg: "$kilometrageUsure" },
        pneusCritiques: { $sum: { $cond: ["$isCritical", 1, 0] } },
        budgetEstimeMAD: {
          $sum: { $cond: ["$isCritical", 3800, 0] },
        },
      },
    },
  ]);

  return result;
};

exports.financialEsg = async () => {
  const result = await Trajet.aggregate([
    {
      $match: {
        statut: "termine",
      },
    },
    {
      $group: {
        _id: {
          siteDepart: "$siteDepart",
          siteArrivee: "$siteArrivee",
        },
        totalTrajets: { $sum: 1 },
        totalGasoilLitres: { $sum: "$volumeGasoil" },
        totalCoutGasoilMAD: { $sum: "$coutGasoil" },
        totalDistanceKm: {
          $sum: { $subtract: ["$kilometrageArrivee", "$kilometrageDepart"] },
        },
      },
    },
    {
      $addFields: {
        emissionsCO2Tonnes: {
          $round: [
            { $divide: [{ $multiply: ["$totalGasoilLitres", 2.68] }, 1000] },
            2,
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        ligne: {
          $concat: ["$_id.siteDepart", " -> ", "$_id.siteArrivee"],
        },
        siteDepart: "$_id.siteDepart",
        siteArrivee: "$_id.siteArrivee",
        totalTrajets: 1,
        totalDistanceKm: 1,
        totalGasoilLitres: 1,
        totalCoutGasoilMAD: 1,
        emissionsCO2Tonnes: 1,
      },
    },
    {
      $sort: { emissionsCO2Tonnes: -1 },
    },
  ]);

  return result;
};

exports.tauxUtilisation = async () => {
  const result = await Truck.aggregate([
    {
      $group: {
        _id: null,
        totalCamions: { $sum: 1 },
        camionsEnMission: {
          $sum: { $cond: [{ $eq: ["$statut", "en_trajet"] }, 1, 0] },
        },
        camionsDisponibles: {
          $sum: { $cond: [{ $eq: ["$statut", "disponible"] }, 1, 0] },
        },
        camionsEnMaintenance: {
          $sum: { $cond: [{ $eq: ["$statut", "en_maintenance"] }, 1, 0] },
        },
      },
    },
    {
      $addFields: {
        denominateur: {
          $sum: ["$camionsDisponibles", "$camionsEnMaintenance"],
        },
      },
    },
    {
      $addFields: {
        tauxUtilisationPourcentage: {
          $cond: [
            { $gt: ["$denominateur", 0] },
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$camionsEnMission", "$denominateur"] },
                    100,
                  ],
                },
                2,
              ],
            },
            0,
          ],
        },
      },
    },

    {
      $project: {
        _id: 0,
        totalCamions: "$totalCamions",
        camionsEnMission: "$camionsEnMission",
        camionsDisponibles: "$camionsDisponibles",
        camionsEnMaintenance: "$camionsEnMaintenance",
        tauxUtilisationPourcentage: "$tauxUtilisationPourcentage",
      },
    },
  ]);

  return result;
};
