const router = require("express").Router();
const verify = require("../../middlewares/verify");
const validate = require("../../middlewares/validation");
const trajetController = require("../../controllers/trajet.controller");

const analytics = require("../../controllers/analytics.controller");

router.get(
  "/v2/analytics/drivers/eco-performance",
  verify.verifyToken,
  verify.isAdmin,
  analytics.getEcoPerformance,
);

router.get(
  "/v2/analytics/tires/health-matrix",
  verify.verifyToken,
  verify.isAdmin,
  analytics.getTiresHealthMatrix,
);

router.get(
  "/v2/analytics/trips/financial-esg",
  verify.verifyToken,
  verify.isAdmin,
  analytics.financialEsg,
);

router.get(
  "/v2/analytics/fleet/utilization-trends",
  verify.verifyToken,
  verify.isAdmin,
  analytics.tauxUtilisation,
);


module.exports = { router };
