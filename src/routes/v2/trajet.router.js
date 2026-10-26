const router = require("express").Router();
const verify = require("../../middlewares/verify");
const trajetController = require("../../controllers/trajet.controller");



router.get(
  "/v2/trips/:id/mission-order-url",
  verify.verifyToken,
  trajetController.getMissionOrderUrl,
);

module.exports = { router };
