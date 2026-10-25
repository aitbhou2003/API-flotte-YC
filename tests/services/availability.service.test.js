const availabilityService = require("../../src/services/availability.service");
const Truck = require("../../src/models/truck.model");
const Remorque = require("../../src/models/remorque.model");
const User = require("../../src/models/user.model");
const Trajet = require("../../src/models/trajet.model");

describe("AvailabilityService - Tests Unitaires", () => {
  const fakeTripData = {
    camion: "truck123",
    remorque: "trailer123",
    chauffeur: "driver123",
    dateDebutPrevue: "2026-10-01",
    dateFinPrevue: "2026-10-05",
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("doit lancer une erreur 404 si le camion n'existe pas", async () => {
    jest.spyOn(Truck, "findById").mockResolvedValue(null);

    await expect(
      availabilityService.checkAvailability(fakeTripData),
    ).rejects.toThrow("Truck not found");
  });

  it("doit lancer une erreur 409 si le camion est en maintenance", async () => {
    jest.spyOn(Truck, "findById").mockResolvedValue({
      _id: "truck123",
      statut: "en_maintenance",
    });

    await expect(
      availabilityService.checkAvailability(fakeTripData),
    ).rejects.toThrow("Truck is under maintenance");
  });

  it("doit lancer une erreur 409 si le chauffeur est suspendu", async () => {
    jest
      .spyOn(Truck, "findById")
      .mockResolvedValue({ _id: "truck123", statut: "disponible" });
    jest
      .spyOn(Remorque, "findById")
      .mockResolvedValue({ _id: "trailer123", statut: "disponible" });
    jest.spyOn(User, "findById").mockResolvedValue({
      _id: "driver123",
      role: "chauffeur",
      statue: "suspendu",
    });

    await expect(
      availabilityService.checkAvailability(fakeTripData),
    ).rejects.toThrow("A suspended driver cannot be assigned to a trip");
  });

  it("doit lancer une erreur 409 si le camion est déjà assigné à un trajet qui se chevauche", async () => {
    jest
      .spyOn(Truck, "findById")
      .mockResolvedValue({ _id: "truck123", statut: "disponible" });
    jest
      .spyOn(Remorque, "findById")
      .mockResolvedValue({ _id: "trailer123", statut: "disponible" });
    jest
      .spyOn(User, "findById")
      .mockResolvedValue({
        _id: "driver123",
        role: "chauffeur",
        statue: "actif",
      });

    jest.spyOn(Trajet, "exists").mockResolvedValue({ _id: "autreTrajet123" });

    await expect(
      availabilityService.checkAvailability(fakeTripData),
    ).rejects.toThrow("Truck is already assigned to an overlapping trip");
  });

  it("doit retourner true si toutes les ressources sont disponibles sans conflit", async () => {
    jest
      .spyOn(Truck, "findById")
      .mockResolvedValue({ _id: "truck123", statut: "disponible" });
    jest
      .spyOn(Remorque, "findById")
      .mockResolvedValue({ _id: "trailer123", statut: "disponible" });
    jest
      .spyOn(User, "findById")
      .mockResolvedValue({
        _id: "driver123",
        role: "chauffeur",
        statue: "actif",
      });

    jest.spyOn(Trajet, "exists").mockResolvedValue(null);

    const resultat = await availabilityService.checkAvailability(fakeTripData);

    expect(resultat).toBe(true);
  });
});