const maintenanceRuleService = require("../services/maintenanceRule.service");

exports.store = async (req, res) => {
  try {
    const rule = await maintenanceRuleService.createMaintenanceRule(req.body);

    res.status(201).json({
      success: true,
      message: "Maintenance rule created successfully",
      rule,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.index = async (req, res) => {
  try {
    const rules =
      await maintenanceRuleService.getAllMaintenanceRules();

    res.status(200).json({
      success: true,
      rules,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.show = async (req, res) => {
  try {
    const rule =
      await maintenanceRuleService.getMaintenanceRuleById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Maintenance rule not found",
      });
    }

    res.status(200).json({
      success: true,
      rule,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const rule =
      await maintenanceRuleService.updateMaintenanceRule(
        req.params.id,
        req.body
      );

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Maintenance rule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance rule updated successfully",
      rule,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const rule =
      await maintenanceRuleService.deleteMaintenanceRule(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Maintenance rule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance rule deleted successfully",
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};