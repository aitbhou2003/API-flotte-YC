
class CreateTruckDTO {
  constructor(data) {
    this.immatriculation = data.immatriculation;
    this.marque = data.marque;
    this.kilometrageTotal = data.kilometrageTotal;
  }
}

class UpdateTruckDTO {
  constructor(data) {
    if (data.immatriculation !== undefined) {
      this.immatriculation = data.immatriculation;
    }

    if (data.marque !== undefined) {
      this.marque = data.marque;
    }

    if (data.kilometrageTotal !== undefined) {
      this.kilometrageTotal = data.kilometrageTotal;
    }

    if (data.statut !== undefined) {
      this.statut = data.statut;
    }
  }
}

module.exports = {
  CreateTruckDTO,
  UpdateTruckDTO,
};
