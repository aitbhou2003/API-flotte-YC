const router = require("express").Router();

const Truck = require("../controllers/truck.controller");
const verify = require("../middlewares/verify");

const validate = require("../middlewares/validation");

const {
  createTruckSchema,
  updateTruckSchema,
} = require("../validators/truck.validator");


router.post(
  "/trucks",
  verify.verifyToken,
  verify.isAdmin,
  validate(createTruckSchema),
  Truck.store
);


router.get(
  "/trucks",
  verify.verifyToken,
  verify.isAdmin,
  Truck.index
);


router.get(
  "/trucks/:id",
  verify.verifyToken,
  verify.isAdmin,
  Truck.show
);


router.put(
  "/trucks/:id",
  verify.verifyToken,
  verify.isAdmin,
  validate(updateTruckSchema),
  Truck.update
);


router.delete(
  "/trucks/:id",
  verify.verifyToken,
  verify.isAdmin,
  Truck.destroy
);


module.exports = {
  router,
};