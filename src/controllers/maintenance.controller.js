const maintenanceService = require("../services/maintenance.service");

exports.store = async (req, res) => {
  try {
    const maintenance =
      await maintenanceService.createMaintenance(req.body);

    res.status(201).json({
      success: true,
      message: "Maintenance created successfully",
      maintenance,
    });
  } catch (error) {
    console.log("create maintenance error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.index = async (req, res) => {
  try {
    const maintenances =
      await maintenanceService.getAllMaintenances();

    res.status(200).json({
      success: true,
      maintenances,
    });
  } catch (error) {
    console.log("get maintenances error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.show = async (req, res) => {
  try {
    const maintenance =
      await maintenanceService.getMaintenanceById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance not found",
      });
    }

    res.status(200).json({
      success: true,
      maintenance,
    });
  } catch (error) {
    console.log("get maintenance error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const maintenance =
      await maintenanceService.updateMaintenance(
        req.params.id,
        req.body
      );

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance updated successfully",
      maintenance,
    });
  } catch (error) {
    console.log("update maintenance error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const maintenance =
      await maintenanceService.deleteMaintenance(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance deleted successfully",
    });
  } catch (error) {
    console.log("delete maintenance error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};