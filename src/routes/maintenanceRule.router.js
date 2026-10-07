const router = require("express").Router();

const MaintenanceRule = require("../controllers/maintenanceRule.controller");
const verify = require("../middlewares/verify");
const validate = require("../middlewares/validation");

const {
  createMaintenanceRuleSchema,
  updateMaintenanceRuleSchema,
} = require("../validators/maintenanceRule.validator");

router.post(
  "/regles-maintenance",
  verify.verifyToken,
  verify.isAdmin,
  validate(createMaintenanceRuleSchema),
  MaintenanceRule.store
);

router.get(
  "/regles-maintenance",
  verify.verifyToken,
  verify.isAdmin,
  MaintenanceRule.index
);

router.get(
  "/regles-maintenance/:id",
  verify.verifyToken,
  verify.isAdmin,
  MaintenanceRule.show
);

router.put(
  "/regles-maintenance/:id",
  verify.verifyToken,
  verify.isAdmin,
  validate(updateMaintenanceRuleSchema),
  MaintenanceRule.update
);

router.delete(
  "/regles-maintenance/:id",
  verify.verifyToken,
  verify.isAdmin,
  MaintenanceRule.destroy
);

module.exports = { router };