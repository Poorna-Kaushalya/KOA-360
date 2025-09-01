const mongoose = require("mongoose");

const AvgSensorSchema = new mongoose.Schema({
  device_id: String,
  avg_ax: Number,
  avg_ay: Number,
  avg_az: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AvgSensorData", AvgSensorSchema);
