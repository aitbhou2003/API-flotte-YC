const Truck = require("../../src/models/truck.model");
const Remorque = require("../../src/models/remorque.model");
const availabilityService = require("../../src/services/availability.service");
const maintenanceService = require("../../src/services/maintenance.service");
const trajetService = require("../../src/services/trajet.service");
const Trajet = require("../../src/models/trajet.model");

describe("tester la fontion de demarage de tarjet ", () => {
  const fakeChauffeurId = "driver123";
  const fakeTrajetId = "trajet123";
  const fakeTruckId = "truck123";
  const fakeRemorqueId = "remorque123";

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("doit lancer une error 404 si le trajet est introuvable", async () => {
    jest.spyOn(Trajet, "findOne").mockResolvedValue(null);

    await expect(
      trajetService.demarrerTrajet(fakeTrajetId, fakeChauffeurId, 100000),
    ).rejects.toThrow("Trajet introuvable ou non attribué à ce chauffeur");
  });

  it("doit lancer une erreur 409 si le trajet pas dans le status a faire", async () => {
    jest.spyOn(Trajet, "findOne").mockResolvedValue({
      _id: fakeTrajetId,
      statut: "en_cours",
    });
    await expect(
      trajetService.demarrerTrajet(fakeTrajetId, fakeChauffeurId, 100000),
    ).rejects.toThrow("Seul un trajet à faire peut être démarré");
  });

  it("doit lancer une erreur 409 si le camion en matenance", async () => {
    jest.spyOn(Trajet, "findOne").mockResolvedValue({
      _id: fakeTrajetId,
      camion: fakeTruckId,
      statut: "a_faire",
    });
    jest.spyOn(Truck, "findById").mockResolvedValue({
      _id: fakeTruckId,
      statut: "en_maintenance",
    });

    await expect(
      trajetService.demarrerTrajet(fakeTrajetId, fakeChauffeurId, 100000),
    ).rejects.toThrow("Impossible de démarrer : le camion est en maintenance");
  });

  it("doit lancer un erreur 400 si le kilométrage de départ est inférieur au kilométrage actuel du camion", async () => {
    jest.spyOn(Trajet, "findOne").mockResolvedValue({
      _id: fakeTrajetId,
      chauffeur: fakeChauffeurId,
      statut: "a_faire",
    });
    jest.spyOn(Truck, "findById").mockResolvedValue({
      _id: fakeTruckId,
      statut: "disponible",
      kilometrageTotal: 200000,
    });

    await expect(
      trajetService.demarrerTrajet(fakeTrajetId, fakeChauffeurId, 100000),
    ).rejects.toThrow(
      "Le kilométrage de départ ne peut pas être inférieur au kilométrage actuel du camion",
    );
  });
  it("doit demarer le trajet avec success et mettre a joure les status", async () => {
    const fakeTrajet = {
      _id: fakeTrajetId,
      camion: fakeTruckId,
      remorque: fakeRemorqueId,
      statut: "a_faire",
      save: jest.fn().mockResolvedValue(true),
    };

    const fakeCamion = {
      _id: fakeTruckId,
      statut: "disponible",
      kilometrageTotal: 100000,
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(Trajet, "findOne").mockResolvedValue(fakeTrajet);
    jest.spyOn(Truck, "findById").mockResolvedValue(fakeCamion);
    jest.spyOn(Remorque, "findByIdAndUpdate").mockResolvedValue({});

    const result = await trajetService.demarrerTrajet(
      fakeTrajetId,
      fakeChauffeurId,
      120000,
    );

    expect(fakeTrajet.statut).toBe("en_cours");
    expect(fakeCamion.statut).toBe("en_trajet");
    expect(fakeTrajet.kilometrageDepart).toBe(120000);
    expect(fakeTrajet.save).toHaveBeenCalled();
    expect(fakeCamion.save).toHaveBeenCalled();
    expect(result).toBe(fakeTrajet);
  });
});

describe("tester la fonction de terniner un trahet", () => {
  const fakeChauffeurId = "driver123";
  const fakeTrajetId = "trajet123";
  const fakeTruckId = "truck123";
  const fakeRemorqueId = "remorque123";

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("doit lancer une erreure 404 si le trajet est introuvablle", async () => {
    jest.spyOn(Trajet, "findOne").mockResolvedValue(null);

    await expect(
      trajetService.terminerTrajet(fakeTrajetId, fakeChauffeurId, {}),
    ).rejects.toThrow("Trajet introuvable ou non attribué à ce chauffeur");
  });

  it("dlancer un erreure  409 si un trajet pas un statue en cours", async () => {
    jest.spyOn(Trajet, "findOne").mockResolvedValue({
      _id: fakeTrajetId,
      statut: "a_faire",
      chauffeur: fakeChauffeurId,
    });

    await expect(
      trajetService.terminerTrajet(fakeTrajetId, fakeChauffeurId, {}),
    ).rejects.toThrow("Seul un trajet en cours peut être terminé");
  });

  it("doit lancer un erreure 400 si Le kilométrage d'arrivée est inferieur au kilométrage de départ", async () => {
    jest.spyOn(Trajet, "findOne").mockResolvedValue({
      _id: fakeTrajetId,
      chauffeur: fakeChauffeurId,
      statut: "en_cours",
      kilometrageDepart: 10000,
    });

    await expect(
      trajetService.terminerTrajet(fakeTrajetId, fakeChauffeurId, {
        kilometrageArrivee: 9000,
      }),
    ).rejects.toThrow(
      "Le kilométrage d'arrivée doit être supérieur au kilométrage de départ",
    );
  });

  it("doit lancer une erreure si le camion est introuvable", async () => {
    jest.spyOn(Trajet, "findOne").mockResolvedValue({
      _id: fakeTrajetId,
      chauffeur: fakeChauffeurId,
      statut: "en_cours",
      kilometrageDepart: 10000,
    });
    jest.spyOn(Truck, "findById").mockResolvedValue(null);

    await expect(
      trajetService.terminerTrajet(fakeTrajetId, fakeChauffeurId, {
        kilometrageArrivee: 20000,
      }),
    ).rejects.toThrow("Camion introuvable");
  });

  it("doit terminer le trajet et calculer la distance et la consommation L/100km avec succès", async () => {
    const fakeTrajet = {
      _id: fakeTrajetId,
      chauffeur: fakeChauffeurId,
      statut: "en_cours",
      kilometrageDepart: 100000,
      save: jest.fn().mockResolvedValue(true),
      camion: fakeTruckId, 
      remorque: fakeRemorqueId, 
    };

    const fakeCamion = {
      _id: fakeTruckId,
      kilometrageTotal: 100000,
      save: jest.fn().mockResolvedValue(true),
    };

    const fakeRemoque = {
      _id: fakeRemorqueId,
      kilometrageTotal: 50000,
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(Trajet, "findOne").mockResolvedValue(fakeTrajet);
    jest.spyOn(Truck, "findById").mockResolvedValue(fakeCamion);
    jest.spyOn(Remorque, "findById").mockResolvedValue(fakeRemoque);
    jest
      .spyOn(maintenanceService, "checkTruckMaintenance")
      .mockResolvedValue({});

    const result = await trajetService.terminerTrajet(
      fakeTrajetId,
      fakeChauffeurId,
      {
        kilometrageArrivee: 110000,
        volumeGasoil: 300,
        coutGasoil: 4200,
        remarquesVehicule: "remaque : test unitaire marche bien",
      },
    );

    expect(fakeTrajet.statut).toBe("termine");
    expect(fakeTrajet.kilometrageArrivee).toBe(110000);
    expect(fakeTrajet.save).toHaveBeenCalled();
    expect(fakeCamion.statut).toBe("disponible");
    expect(fakeCamion.save).toHaveBeenCalled();
    expect(fakeRemoque.save).toHaveBeenCalled();
    expect(fakeRemoque.statut).toBe("disponible");

    expect(result.distanceParcourue).toBe(10000);
    expect(result.consommationMoyenne).toBe(3);
  });
});
