const truckService = require("../services/truck.service");

exports.store = async (req, res) => {
  try {
    const truck = await truckService.createTruck(req.body);

    res.status(201).json({
      success: true,
      message: "Truck created successfully",
      truck,
    });
  } catch (error) {
    console.log("create truck error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Cette immatriculation existe déjà",
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
    const trucks = await truckService.getAllTrucks();

    res.status(200).json({
      success: true,
      trucks,
    });
  } catch (error) {
    console.log("get trucks error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.show = async (req, res) => {
  try {
    const truck = await truckService.getTruckById(req.params.id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck not found",
      });
    }

    res.status(200).json({
      success: true,
      truck,
    });
  } catch (error) {
    console.log("get truck error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const truck = await truckService.updateTruck(
      req.params.id,
      req.body
    );

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Truck updated successfully",
      truck,
    });
  } catch (error) {
    console.log("update truck error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Cette immatriculation existe déjà",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const truck = await truckService.deleteTruck(req.params.id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Truck deleted successfully",
    });
  } catch (error) {
    console.log("delete truck error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};