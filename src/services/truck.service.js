const Truck = require("../models/truck.model")

exports.createTruck = async (data)=>{
    const truck = await Truck.create(data)

    return truck
}

exports.getAllTrucks = async()=>{
    const truks = Truck.find();
    return truks
}

