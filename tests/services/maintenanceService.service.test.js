// tests/services/maintenance.service.test.js

const maintenanceService = require("../../src/services/maintenance.service");
const Truck = require("../../src/models/truck.model");
const MaintenanceRule = require("../../src/models/maintenanceRule.model");
const Maintenance = require("../../src/models/maintenance.model");

const mongoose = require("mongoose");
const fakeTruckId = new mongoose.Types.ObjectId();

describe("tester la fonction checkTruckMaintenance", () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("doit lancer une erreur 404 si le camion est introuvable", async () => {
    jest.spyOn(Truck, "findById").mockResolvedValue(null);

    await expect(
      maintenanceService.checkTruckMaintenance(fakeTruckId)
    ).rejects.toThrow("Truck not found");
  });

  it("doit retourner maintenanceRequired false si aucune règle n'existe", async () => {
    jest.spyOn(Truck, "findById").mockResolvedValue({
      _id: fakeTruckId,
      kilometrageTotal: 50000,
      statut: "disponible",
    });

    jest.spyOn(MaintenanceRule, "find").mockResolvedValue([]);

    const result = await maintenanceService.checkTruckMaintenance(fakeTruckId);

    expect(result.maintenanceRequired).toBe(false);
  });

  it("doit retourner maintenanceRequired false si le kilométrage est inférieur au seuil", async () => {
    jest.spyOn(Truck, "findById").mockResolvedValue({
      _id: fakeTruckId,
      kilometrageTotal: 4000,
      statut: "disponible",
    });

    jest.spyOn(MaintenanceRule, "find").mockResolvedValue([
      { type: "vidange", periodiciteKm: 5000 },
    ]);

    const result = await maintenanceService.checkTruckMaintenance(fakeTruckId);

    expect(result.maintenanceRequired).toBe(false);
  });

  it("doit ne pas créer de doublon si une alerte existe déjà", async () => {
    const fakeTruck = {
      _id: fakeTruckId,
      kilometrageTotal: 10000,
      statut: "en_maintenance",
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(Truck, "findById").mockResolvedValue(fakeTruck);

    jest.spyOn(MaintenanceRule, "find").mockResolvedValue([
      { type: "vidange", periodiciteKm: 5000 },
    ]);

    jest.spyOn(Maintenance, "findOne").mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      type: "vidange",
      statut: "alerte_declenchee",
    });

    const createSpy = jest.spyOn(Maintenance, "create").mockResolvedValue({});

    const result = await maintenanceService.checkTruckMaintenance(fakeTruckId);

    expect(createSpy).not.toHaveBeenCalled();
    expect(result.maintenanceRequired).toBe(true);
  });

  it("doit créer une alerte et mettre le camion en maintenance si le seuil est atteint", async () => {
    const fakeTruck = {
      _id: fakeTruckId,
      kilometrageTotal: 10000,
      statut: "disponible",
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(Truck, "findById").mockResolvedValue(fakeTruck);

    jest.spyOn(MaintenanceRule, "find").mockResolvedValue([
      { type: "vidange", periodiciteKm: 5000 },
    ]);

    jest.spyOn(Maintenance, "findOne").mockResolvedValue(null);

    const createSpy = jest.spyOn(Maintenance, "create").mockResolvedValue({});

    const result = await maintenanceService.checkTruckMaintenance(fakeTruckId);

    expect(createSpy).toHaveBeenCalledWith({
      camion: fakeTruckId,
      type: "vidange",
      statut: "alerte_declenchee",
      kilometrageAuDeclenchement: 10000,
    });

    expect(fakeTruck.statut).toBe("en_maintenance");
    expect(fakeTruck.save).toHaveBeenCalled();

    expect(result.maintenanceRequired).toBe(true);
  });

});