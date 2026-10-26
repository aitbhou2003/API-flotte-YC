const PDFDocument = require("pdfkit");


exports.genererPdfBuffer = (trajet) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    doc.fontSize(22).font("Helvetica-Bold").text("ORDRE DE MISSION", { align: "center" });
    doc.fontSize(11).font("Helvetica").text("Société de Transport Routier — Youssoufia", { align: "center" });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#333333").stroke();
    doc.moveDown(1);

    // 1. Chauffeur
    doc.fontSize(14).font("Helvetica-Bold").text("1. Chauffeur Assigné");
    doc.moveDown(0.3);
    doc.fontSize(11).font("Helvetica");
    doc.text(`Nom complet : ${trajet.chauffeur.firstName} ${trajet.chauffeur.lastName}`);
    doc.text(`Email       : ${trajet.chauffeur.email}`);
    doc.moveDown(1);

    // 2. Trajet
    doc.fontSize(14).font("Helvetica-Bold").text("2. Détails du Trajet");
    doc.moveDown(0.3);
    doc.fontSize(11).font("Helvetica");
    doc.text(`Site de départ : ${trajet.siteDepart}`);
    doc.text(`Site d'arrivée : ${trajet.siteArrivee}`);
    doc.text(`Marchandise    : ${trajet.marchandise}`);
    doc.text(`Statut actuel  : ${trajet.statut.toUpperCase()}`);
    doc.moveDown(1);

    // 3. Véhicules
    doc.fontSize(14).font("Helvetica-Bold").text("3. Véhicules de Transport");
    doc.moveDown(0.3);
    doc.fontSize(11).font("Helvetica");
    doc.text(`Camion   : ${trajet.camion.marque} (${trajet.camion.immatriculation})`);
    doc.text(`Remorque : ${trajet.remorque.immatriculation} (${trajet.remorque.type})`);
    doc.moveDown(2);

    // Pied de page
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#cccccc").stroke();
    doc.moveDown(1);
    doc.fontSize(9).font("Helvetica").fillColor("#666666").text(
      `Document officiel généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
      { align: "center" }
    );

    doc.end();
  });
};