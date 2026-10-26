const trajetService = require("../services/trajet.service");
const pdfService = require("../services/pdf.service");
const storageService = require("../services/storage.service");


exports.store = async (req, res) => {
  try {
    const trajet = await trajetService.createTrajet(req.body);

    res.status(201).json({
      success: true,
      message: "Trajet created successfully",
      trajet,
    });
  } catch (error) {

    if (error.statusCode === 404 || error.statusCode === 409) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.index = async (req, res) => {
  try {
    const trajets = await trajetService.getAllTrajets();

    res.status(200).json({
      success: true,
      trajets,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.show = async (req, res) => {
  try {
    const trajet = await trajetService.getTrajetById(req.params.id);

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: "Trajet not found",
      });
    }

    res.status(200).json({
      success: true,
      trajet,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const trajet = await trajetService.updateTrajet(
      req.params.id,
      req.body
    );

    

    res.status(200).json({
      success: true,
      message: "Trajet updated successfully",
      trajet,
    });
  } catch (error) {

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const trajet = await trajetService.deleteTrajet(req.params.id);

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: "Trajet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trajet deleted successfully",
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.mesTrajets = async (req, res) => {
  try {
    const trajets = await trajetService.getTrajetsByChauffeur(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      trajets,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.demarrer = async (req, res) => {
  try {
    const trajet = await trajetService.demarrerTrajet(
      req.params.id,
      req.user.userId,
      req.body.kilometrageDepart
    );

    return res.status(200).json({
      success: true,
      message: "Trajet démarré avec succès",
      trajet,
    });
  } catch (error) {

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Internal server error",
    });
  }
};


exports.terminer = async (req, res) => {
  try {
    const resultat = await trajetService.terminerTrajet(
      req.params.id,
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Trajet terminé avec succès",
      ...resultat,
    });
  } catch (error) {

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Internal server error",
    });
  }
};





// ✅ À GARDER (GET /api/v2/trips/:id/mission-order-url)
exports.getMissionOrderUrl = async (req, res, next) => {
  try {
    const trajet = await trajetService.getTrajetById(req.params.id);

    if (!trajet) {
      return res.status(404).json({
        success: false,
        message: "Trajet introuvable",
      });
    }

    // 🔒 SÉCURITÉ MÉTIER :
    // - Si c'est un ADMIN : il a accès à TOUS les ordres de mission.
    // - Si c'est un CHAUFFEUR : il n'a le droit QUE sur son propre trajet assigné.
    const isOwnerDriver =
      req.user.userRole === "chauffeur" &&
      trajet.chauffeur._id.toString() === req.user.userId;
    const isAdmin = req.user.userRole === "admin";

    if (!isAdmin && !isOwnerDriver) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé : vous ne pouvez pas accéder à l'ordre de mission d'un autre chauffeur",
      });
    }

    // Nommage de l'objet sur MinIO S3 : orders/2026/TRP-ID.pdf
    const annee = new Date().getFullYear();
    const s3Key = trajet.s3Key || `orders/${annee}/TRP-${trajet._id}.pdf`;

    // Si le PDF n'a pas encore été généré et versé sur MinIO :
    if (!trajet.s3Key) {
      const pdfBuffer = await pdfService.genererPdfBuffer(trajet);
      await storageService.uploadFile(pdfBuffer, s3Key);

      // On sauvegarde la clé S3 dans MongoDB
      trajet.s3Key = s3Key;
      await trajet.save();
    }

    // Génération de la Presigned URL temporaire (valable 15 minutes)
    const downloadUrl = await storageService.getPresignedUrl(s3Key);

    return res.status(200).json({
      success: true,
      message: "Presigned URL générée avec succès (valable 15 minutes)",
      s3Key,
      expiresIn: "15 minutes",
      downloadUrl,
    });
  } catch (error) {
    next(error);
  }
};