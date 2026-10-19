const Trajet = require("../models/trajet.model");
const Tire = require("../models/tire.model");

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
