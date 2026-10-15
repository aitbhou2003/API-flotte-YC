
const truckService = require("../../src/services/truck.service");
const truckController = require("../../src/controllers/truck.controller");

// Mock the service: no real database queries will be executed.
jest.mock("../../src/services/truck.service");

describe("Truck Controller - index", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should return all trucks with status 200", async () => {
    const mockTrucks = [
      {
        _id: "truck123",
        immatriculation: "12345-A-6",
        marque: "Volvo",
        kilometrageTotal: 125000,
        statut: "disponible",
      },
      {
        _id: "truck456",
        immatriculation: "67890-B-6",
        marque: "Mercedes",
        kilometrageTotal: 80000,
        statut: "disponible",
      },
    ];

    truckService.getAllTrucks.mockResolvedValue(mockTrucks);

    await truckController.index(req, res);

    expect(truckService.getAllTrucks).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      trucks: mockTrucks,
    });
  });

  it("should return status 500 if the service fails", async () => {
    truckService.getAllTrucks.mockRejectedValue(
      new Error("Database error")
    );

    await truckController.index(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
  });
});
