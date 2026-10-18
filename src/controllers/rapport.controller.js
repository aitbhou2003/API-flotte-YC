const rapportService = require("../services/rapport.service");

exports.consommation = async (req, res, next) => {
  try {
    const rapport = await rapportService.getRapportConsommation();
    return res.status(200).json({
      success: true,
      rapport,
    });
  } catch (error) {
    next(error);
  }
};

exports.kilometrage = async (req, res, next) => {
  try {
    const rapport = await rapportService.getRapportKilometrage();
    return res.status(200).json({
      success: true,
      rapport,
    });
  } catch (error) {
    next(error);
  }
};

exports.alertesMaintenance = async (req, res, next) => {
  try {
    const rapport = await rapportService.getRapportAlertesMaintenance();
    return res.status(200).json({
      success: true,
      ...rapport,
    });
  } catch (error) {
    next(error);
  }
};