const { restore } = require("pdfkit");
const analytics = require("../services/analytics.service");

exports.getEcoPerformance = async (req, res, next) => {
  try {
    const result = await analytics.getEcoPerformance();

    return res.status(200).json({
      success: true,
      message:
        "Score d’Éco-Conduite & Performance Chauffeur calculer avec success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTiresHealthMatrix = async (req, res, next) => {
  try {
    const data = await analytics.getTiresHealthMatrix();

    return res.status(200).json({
      success: true,
      message: "Affichage un bilan des pneus par position passser avec success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.financialEsg = async (req, res, next) => {
  try {
    const data = await analytics.financialEsg();

    return res.status(200).json({
      success: true,
      message: "ESG calculer avec success",
      data: data,
    });
  } catch (error) {
    next(error)
  }
};


exports.tauxUtilisation = async (req, res, next) => {
  try {
    const data = await analytics.tauxUtilisation;

    return res.status(200).json({
      success: true,
      message: "taux d'utilisation calculer avec success",
      data: data,
    });
  } catch (error) {
    next(error)
  }
};
