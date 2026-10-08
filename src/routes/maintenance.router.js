const router = require("express").Router();

const Maintenance = require("../controllers/maintenance.controller");

const verify = require("../middlewares/verify");
const validate = require("../middlewares/validation");

const {
  createMaintenanceSchema,
  updateMaintenanceSchema,
} = require("../validators/maintenance.validator");

router.post(
  "/maintenances",
  verify.verifyToken,
  verify.isAdmin,
  validate(createMaintenanceSchema),
  Maintenance.store
);

router.get(
  "/maintenances",
  verify.verifyToken,
  verify.isAdmin,
  Maintenance.index
);

router.get(
  "/maintenances/:id",
  verify.verifyToken,
  verify.isAdmin,
  Maintenance.show
);

router.put(
  "/maintenances/:id",
  verify.verifyToken,
  verify.isAdmin,
  validate(updateMaintenanceSchema),
  Maintenance.update
);

router.delete(
  "/maintenances/:id",
  verify.verifyToken,
  verify.isAdmin,
  Maintenance.destroy
);

router.get(
  "/maintenances/check-truck/:truckId",
  verify.verifyToken,
  verify.isAdmin,
  Maintenance.checkTruckMaintenance
);

module.exports = { router };