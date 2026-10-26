const router = require("express").Router();

const Trajet = require("../controllers/trajet.controller");
const verify = require("../middlewares/verify");
const validate = require("../middlewares/validation");

const {
  createTrajetSchema,
  updateTrajetSchema,
  demarrerTrajetSchema,
  terminerTrajetSchema,
} = require("../validators/trajet.validator");

router.post(
  "/trajets",
  verify.verifyToken,
  verify.isAdmin,
  validate(createTrajetSchema),
  Trajet.store,
);

router.get("/trajets", verify.verifyToken, verify.isAdmin, Trajet.index);

router.get(
  "/mes-trajets",
  verify.verifyToken,
  verify.isChauffeur,
  Trajet.mesTrajets,
);

router.patch(
  "/trajets/:id/demarrer",
  verify.verifyToken,
  verify.isChauffeur,
  validate(demarrerTrajetSchema),
  Trajet.demarrer,
);

router.patch(
  "/trajets/:id/terminer",
  verify.verifyToken,
  verify.isChauffeur,
  validate(terminerTrajetSchema),
  Trajet.terminer,
);

router.get("/trajets/:id", verify.verifyToken, verify.isAdmin, Trajet.show);

router.put(
  "/trajets/:id",
  verify.verifyToken,
  verify.isAdmin,
  validate(updateTrajetSchema),
  Trajet.update,
);

router.delete(
  "/trajets/:id",
  verify.verifyToken,
  verify.isAdmin,
  Trajet.destroy,
);



module.exports = { router };
