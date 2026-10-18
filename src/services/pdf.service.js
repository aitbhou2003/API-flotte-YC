const PDFDocument = require("pdfkit");

exports.genererOrdreMission = (trajet, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="ordre-mission-${trajet._id}.pdf"`
  );

  doc.pipe(res);

  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("ORDRE DE MISSION", { align: "center" });

  doc
    .fontSize(11)
    .font("Helvetica")
    .text("Société de Transport Routier — Youssoufia", { align: "center" });

  doc.moveDown(0.5);

  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#333333")
    .stroke();

  doc.moveDown(1);

  doc.fontSize(14).font("Helvetica-Bold").text("1. Chauffeur Assigné");
  doc.moveDown(0.3);

  doc.fontSize(11).font("Helvetica");
  doc.text(`Nom complet : ${trajet.chauffeur.firstName} ${trajet.chauffeur.lastName}`);
  doc.text(`Email       : ${trajet.chauffeur.email}`);

  doc.moveDown(1);

  doc.fontSize(14).font("Helvetica-Bold").text("2. Détails du Trajet");
  doc.moveDown(0.3);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("fr-FR") : "Non définie";

  doc.fontSize(11).font("Helvetica");
  doc.text(`Site de départ : ${trajet.siteDepart}`);
  doc.text(`Site d'arrivée : ${trajet.siteArrivee}`);
  doc.text(`Marchandise    : ${trajet.marchandise}`);
  doc.text(`Date de départ : ${formatDate(trajet.dateDebutPrevue)}`);
  doc.text(`Date d'arrivée : ${formatDate(trajet.dateFinPrevue)}`);
  doc.text(`Statut actuel  : ${trajet.statut.toUpperCase()}`);

  doc.moveDown(1);

  doc.fontSize(14).font("Helvetica-Bold").text("3. Véhicules de Transport");
  doc.moveDown(0.3);

  doc.fontSize(11).font("Helvetica");
  doc.text(`Camion   : ${trajet.camion.marque} (Immatriculation: ${trajet.camion.immatriculation})`);
  doc.text(`Remorque : ${trajet.remorque.immatriculation} (Type: ${trajet.remorque.type})`);

  doc.moveDown(2);

  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#cccccc")
    .stroke();

  doc.moveDown(1);

  doc.fontSize(11).font("Helvetica-Bold");
  doc.text("Signature du Chauffeur :", 50, doc.y, { continued: true });
  doc.text("Signature de l'Administration :", 320, doc.y);

  doc.moveDown(3);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#666666")
    .text(
      `Document officiel généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
      50,
      doc.y,
      { align: "center" }
    );

  doc.end();
};