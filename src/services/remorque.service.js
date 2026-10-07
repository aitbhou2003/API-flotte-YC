const Remorque = require("../models/remorque.model");

exports.createRemorque = async (data) => {
  return await Remorque.create(data);
};

exports.getAllRemorques = async () => {
  return await Remorque.find();
};

exports.getRemorqueById = async (id) => {
  return await Remorque.findById(id);
};

exports.updateRemorque = async (id, data) => {
  return await Remorque.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

exports.deleteRemorque = async (id) => {
  return await Remorque.findByIdAndDelete(id);
};