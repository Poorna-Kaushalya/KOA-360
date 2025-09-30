const mongoose = require("mongoose");

const RawSensorSchema = new mongoose.Schema(
  {
    device_id: { type: String, required: true },
    ax: { type: Number, required: true },
    ay: { type: Number, required: true },
    az: { type: Number, required: true },
    gx: { type: Number }, // optional
    gy: { type: Number },
    gz: { type: Number },
    temp: { type: Number },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("RawSensorData", RawSensorSchema);
