const Joi = require("joi");

const createMaintenanceRuleSchema = Joi.object({
  type: Joi.string()
    .valid("vidange", "revision", "changement_pneu")
    .required(),

  periodiciteKm: Joi.number()
    .min(1)
    .required(),

  description: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required(),
});

const updateMaintenanceRuleSchema = Joi.object({
  type: Joi.string()
    .valid("vidange", "revision", "changement_pneu"),

  periodiciteKm: Joi.number()
    .min(1),

  description: Joi.string()
    .trim()
    .min(3)
    .max(200),
}).min(1);

module.exports = {
  createMaintenanceRuleSchema,
  updateMaintenanceRuleSchema,
};