const mongoose = require("mongoose");

const AvgSensorSchema = new mongoose.Schema(
  {
    device_id: { type: String, required: true },
    avg_ax: { type: Number, required: true },
    avg_ay: { type: Number, required: true },
    avg_az: { type: Number, required: true },
    avg_gx: { type: Number }, // optional, if you compute gyro averages
    avg_gy: { type: Number },
    avg_gz: { type: Number },
    avg_temp: { type: Number },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("AvgSensorData", AvgSensorSchema);
