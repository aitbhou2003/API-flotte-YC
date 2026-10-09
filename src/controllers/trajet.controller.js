const trajetService = require("../services/trajet.service");

exports.store = async (req, res) => {
  try {
    const trajet = await trajetService.createTrajet(req.body);

    res.status(201).json({
      success: true,
      message: "Trajet created successfully",
      trajet,
    });
  } catch (error) {
    console.log("create trajet error:", error);

    if (error.statusCode === 404 || error.statusCode === 409) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.index = async (req, res) => {
  try {
    const trajets = await trajetService.getAllTrajets();

    res.status(200).json({
      success: true,
      trajets,
    });
  } catch (error) {
    console.log("get trajets error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.show = async (req, res) => {
  try {
    const trajet = await trajetService.getTrajetById(req.params.id);

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: "Trajet not found",
      });
    }

    res.status(200).json({
      success: true,
      trajet,
    });
  } catch (error) {
    console.log("get trajet error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const trajet = await trajetService.updateTrajet(
      req.params.id,
      req.body
    );

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: "Trajet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trajet updated successfully",
      trajet,
    });
  } catch (error) {
    console.log("update trajet error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const trajet = await trajetService.deleteTrajet(req.params.id);

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: "Trajet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trajet deleted successfully",
    });
  } catch (error) {
    console.log("delete trajet error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.mesTrajets = async (req, res) => {
  try {
    const trajets = await trajetService.getTrajetsByChauffeur(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      trajets,
    });
  } catch (error) {
    console.error("mes trajets error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.demarrer = async (req, res) => {
  try {
    const trajet = await trajetService.demarrerTrajet(
      req.params.id,
      req.user.userId,
      req.body.kilometrageDepart
    );

    return res.status(200).json({
      success: true,
      message: "Trajet démarré avec succès",
      trajet,
    });
  } catch (error) {
    console.error("demarrer trajet error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Internal server error",
    });
  }
};


exports.terminer = async (req, res) => {
  try {
    const resultat = await trajetService.terminerTrajet(
      req.params.id,
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Trajet terminé avec succès",
      ...resultat,
    });
  } catch (error) {
    console.error("terminer trajet error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Internal server error",
    });
  }
};

