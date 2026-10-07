const router = require("express").Router();

const Remorque = require("../controllers/remorque.controller");
const verify = require("../middlewares/verify");
const validate = require("../middlewares/validation");

const {
  createRemorqueSchema,
  updateRemorqueSchema,
} = require("../validators/remorque.validator");

router.post(
  "/remorques",
  verify.verifyToken,
  verify.isAdmin,
  validate(createRemorqueSchema),
  Remorque.store
);

router.get(
  "/remorques",
  verify.verifyToken,
  verify.isAdmin,
  Remorque.index
);

router.get(
  "/remorques/:id",
  verify.verifyToken,
  verify.isAdmin,
  Remorque.show
);

router.put(
  "/remorques/:id",
  verify.verifyToken,
  verify.isAdmin,
  validate(updateRemorqueSchema),
  Remorque.update
);

router.delete(
  "/remorques/:id",
  verify.verifyToken,
  verify.isAdmin,
  Remorque.destroy
);

module.exports = {
  router,
};