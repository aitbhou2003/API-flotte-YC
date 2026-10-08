const Joi = require("joi");

const createMaintenanceSchema = Joi.object({
  camion: Joi.string().hex().length(24),

  remorque: Joi.string().hex().length(24),

  pneu: Joi.string().hex().length(24),

  type: Joi.string()
    .valid("vidange", "revision", "changement_pneu")
    .required(),

  kilometrageAuDeclenchement: Joi.number()
    .min(0)
    .required(),
});

const updateMaintenanceSchema = Joi.object({
  statut: Joi.string()
    .valid("alerte_declenchee", "resolue"),

  dateResolution: Joi.date(),
}).min(1);

module.exports = {
  createMaintenanceSchema,
  updateMaintenanceSchema,
};