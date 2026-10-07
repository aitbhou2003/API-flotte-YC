const remorqueService = require("../services/remorque.service");

exports.store = async (req, res) => {
  try {
    const remorque = await remorqueService.createRemorque(req.body);

    res.status(201).json({
      success: true,
      message: "Remorque created successfully",
      remorque,
    });
  } catch (error) {
    console.log("create remorque error:", error);

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
    const remorques = await remorqueService.getAllRemorques();

    res.status(200).json({
      success: true,
      remorques,
    });
  } catch (error) {
    console.log("get remorques error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.show = async (req, res) => {
  try {
    const remorque = await remorqueService.getRemorqueById(
      req.params.id
    );

    if (!remorque) {
      return res.status(404).json({
        success: false,
        message: "Remorque not found",
      });
    }

    res.status(200).json({
      success: true,
      remorque,
    });
  } catch (error) {
    console.log("get remorque error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const remorque = await remorqueService.updateRemorque(
      req.params.id,
      req.body
    );

    if (!remorque) {
      return res.status(404).json({
        success: false,
        message: "Remorque not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Remorque updated successfully",
      remorque,
    });
  } catch (error) {
    console.log("update remorque error:", error);

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
    const remorque = await remorqueService.deleteRemorque(
      req.params.id
    );

    if (!remorque) {
      return res.status(404).json({
        success: false,
        message: "Remorque not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Remorque deleted successfully",
    });
  } catch (error) {
    console.log("delete remorque error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};