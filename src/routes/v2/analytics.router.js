const router = require("express").Router();
const verify = require("../../middlewares/verify");
const validate = require("../../middlewares/validation");

const analytics = require("../../controllers/analytics.controller");

router.get(
  "/v2/analytics/drivers/eco-performance",
  verify.verifyToken,
  verify.isAdmin,
  analytics.getEcoPerformance,
);

module.exports = { router };
