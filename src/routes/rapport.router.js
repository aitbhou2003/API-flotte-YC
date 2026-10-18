const router = require("express").Router();
const Rapport = require("../controllers/rapport.controller");
const verify = require("../middlewares/verify");

router.get("/rapports/consommation", verify.verifyToken, verify.isAdmin, Rapport.consommation);
router.get("/rapports/kilometrage", verify.verifyToken, verify.isAdmin, Rapport.kilometrage);
router.get("/rapports/alertes-maintenance", verify.verifyToken, verify.isAdmin, Rapport.alertesMaintenance);

module.exports = { router };