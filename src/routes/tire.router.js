const router = require("express").Router();

const Tire = require("../controllers/tire.controller");
const verify = require("../middlewares/verify");
const validate = require("../middlewares/validation");

const {
  createTireSchema,
  updateTireSchema,
} = require("../validators/tire.validator");

router.post(
  "/tires",
  verify.verifyToken,
  verify.isAdmin,
  validate(createTireSchema),
  Tire.store
);

router.get(
  "/tires",
  verify.verifyToken,
  verify.isAdmin,
  Tire.index
);

router.get(
  "/tires/:id",
  verify.verifyToken,
  verify.isAdmin,
  Tire.show
);

router.put(
  "/tires/:id",
  verify.verifyToken,
  verify.isAdmin,
  validate(updateTireSchema),
  Tire.update
);

router.delete(
  "/tires/:id",
  verify.verifyToken,
  verify.isAdmin,
  Tire.destroy
);

module.exports = {
  router,
};