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