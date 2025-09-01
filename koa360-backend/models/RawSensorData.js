const mongoose = require("mongoose");

const RawSensorSchema = new mongoose.Schema({
  device_id: String,
  ax: Number,
  ay: Number,
  az: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RawSensorData", RawSensorSchema);
