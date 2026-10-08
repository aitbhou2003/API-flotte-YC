const Joi = require("joi");

const createTrajetSchema = Joi.object({
  siteDepart: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  siteArrivee: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  marchandise: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  dateDebutPrevue: Joi.date().required(),

  dateFinPrevue: Joi.date()
    .greater(Joi.ref("dateDebutPrevue"))
    .required(),

  chauffeur: Joi.string()
    .hex()
    .length(24)
    .required(),

  camion: Joi.string()
    .hex()
    .length(24)
    .required(),

  remorque: Joi.string()
    .hex()
    .length(24)
    .required(),
});

const updateTrajetSchema = Joi.object({
  siteDepart: Joi.string().trim().min(2).max(100),

  siteArrivee: Joi.string().trim().min(2).max(100),

  marchandise: Joi.string().trim().min(2).max(100),

  dateDebutPrevue: Joi.date(),

  dateFinPrevue: Joi.date(),

  chauffeur: Joi.string().hex().length(24),

  camion: Joi.string().hex().length(24),

  remorque: Joi.string().hex().length(24),

  statut: Joi.string().valid(
    "a_faire",
    "en_cours",
    "termine"
  ),

  kilometrageDepart: Joi.number().min(0),

  kilometrageArrivee: Joi.number().min(0),

  volumeGasoil: Joi.number().min(0),

  coutGasoil: Joi.number().min(0),

  remarquesVehicule: Joi.string().trim(),
}).min(1);

module.exports = {
  createTrajetSchema,
  updateTrajetSchema,
};