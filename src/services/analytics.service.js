const Trajet = require("../models/trajet.model");

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
