const Joi = require("joi");

const createTireSchema = Joi.object({
  camion: Joi.string()
    .hex()
    .length(24)
    .required(),

  position: Joi.string()
    .trim()
    .min(2)
    .max(30)
    .required(),

  kilometrageUsure: Joi.number()
    .min(0)
    .required(),
});

const updateTireSchema = Joi.object({
  camion: Joi.string()
    .hex()
    .length(24),

  position: Joi.string()
    .trim()
    .min(2)
    .max(30),

  kilometrageUsure: Joi.number()
    .min(0),
}).min(1);

module.exports = {
  createTireSchema,
  updateTireSchema,
};