const router = require("express").Router();

const Trajet = require("../controllers/trajet.controller");
const verify = require("../middlewares/verify");
const validate = require("../middlewares/validation");

const {
  createTrajetSchema,
  updateTrajetSchema,
} = require("../validators/trajet.validator");

router.post(
  "/trajets",
  verify.verifyToken,
  verify.isAdmin,
  validate(createTrajetSchema),
  Trajet.store
);

router.get(
  "/trajets",
  verify.verifyToken,
  verify.isAdmin,
  Trajet.index
);

router.get(
  "/trajets/:id",
  verify.verifyToken,
  verify.isAdmin,
  Trajet.show
);

router.put(
  "/trajets/:id",
  verify.verifyToken,
  verify.isAdmin,
  validate(updateTrajetSchema),
  Trajet.update
);

router.delete(
  "/trajets/:id",
  verify.verifyToken,
  verify.isAdmin,
  Trajet.destroy
);

module.exports = { router };