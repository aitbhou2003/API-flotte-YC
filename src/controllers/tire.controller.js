const tireService = require("../services/tire.service");

exports.store = async (req, res) => {
  try {
    const tire = await tireService.createTire(req.body);

    res.status(201).json({
      success: true,
      message: "Tire created successfully",
      tire,
    });
  } catch (error) {
    console.log("create tire error:", error);

    if (error.statusCode === 404) {
      return res.status(404).json({
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
    const tires = await tireService.getAllTires();

    res.status(200).json({
      success: true,
      tires,
    });
  } catch (error) {
    console.log("get tires error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.show = async (req, res) => {
  try {
    const tire = await tireService.getTireById(req.params.id);

    if (!tire) {
      return res.status(404).json({
        success: false,
        message: "Tire not found",
      });
    }

    res.status(200).json({
      success: true,
      tire,
    });
  } catch (error) {
    console.log("get tire error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const tire = await tireService.updateTire(
      req.params.id,
      req.body
    );

    if (!tire) {
      return res.status(404).json({
        success: false,
        message: "Tire not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tire updated successfully",
      tire,
    });
  } catch (error) {
    console.log("update tire error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const tire = await tireService.deleteTire(req.params.id);

    if (!tire) {
      return res.status(404).json({
        success: false,
        message: "Tire not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tire deleted successfully",
    });
  } catch (error) {
    console.log("delete tire error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};