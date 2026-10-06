const Joi = require("joi");

const createTruckSchema = Joi.object({
  immatriculation: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required(),

  marque: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  kilometrageTotal: Joi.number()
    .min(0)
    .required(),
});

const updateTruckSchema = Joi.object({
  immatriculation: Joi.string()
    .trim()
    .min(3)
    .max(20),

  marque: Joi.string()
    .trim()
    .min(2)
    .max(50),

  kilometrageTotal: Joi.number()
    .min(0),

  statut: Joi.string().valid(
    "disponible",
    "en_trajet",
    "en_maintenance"
  ),
}).min(1);

module.exports = {
  createTruckSchema,
  updateTruckSchema,
};