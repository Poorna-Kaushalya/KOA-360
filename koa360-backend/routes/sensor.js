const express = require("express");
const RawSensorData = require("../models/RawSensorData");
const AvgSensorData = require("../models/AvgSensorData");

const router = express.Router();

// Save raw sensor data
router.post("/api/sensor-data", async (req, res) => {
  try {
    const newData = new RawSensorData(req.body);
    await newData.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// routes/sensor.js
router.get("/api/device-status", async (req, res) => {
  try {
    // Check if there’s recent raw data from your device in last 10 sec
    const recentData = await RawSensorData.findOne({}, {}, { sort: { createdAt: -1 } });
    const connected = recentData && (new Date() - recentData.createdAt) < 10000;
    res.json({ connected });
  } catch (err) {
    res.json({ connected: false });
  }
});


// Get latest 10 averages
router.get("/api/sensor-data", async (req, res) => {
  const data = await AvgSensorData.find().sort({ createdAt: -1 }).limit(10);
  res.json(data);
});

// Calculate 5-min averages every 5 minutes
setInterval(async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const rawData = await RawSensorData.find({
    createdAt: { $gte: fiveMinutesAgo },
  });

  if (rawData.length > 0) {
    const device_id = rawData[0].device_id;

    let sum_upper = { ax:0, ay:0, az:0, gx:0, gy:0, gz:0, temp:0 };
    let sum_lower = { ax:0, ay:0, az:0, gx:0, gy:0, gz:0, temp:0 };
    let sum_angle = 0;

    rawData.forEach((d) => {
      sum_upper.ax += d.upper.ax;
      sum_upper.ay += d.upper.ay;
      sum_upper.az += d.upper.az;
      sum_upper.gx += d.upper.gx || 0;
      sum_upper.gy += d.upper.gy || 0;
      sum_upper.gz += d.upper.gz || 0;
      sum_upper.temp += d.upper.temp || 0;

      sum_lower.ax += d.lower.ax;
      sum_lower.ay += d.lower.ay;
      sum_lower.az += d.lower.az;
      sum_lower.gx += d.lower.gx || 0;
      sum_lower.gy += d.lower.gy || 0;
      sum_lower.gz += d.lower.gz || 0;
      sum_lower.temp += d.lower.temp || 0;

      sum_angle += d.knee_angle;
    });

    const avgData = new AvgSensorData({
      device_id,
      avg_upper: {
        ax: sum_upper.ax / rawData.length,
        ay: sum_upper.ay / rawData.length,
        az: sum_upper.az / rawData.length,
        gx: sum_upper.gx / rawData.length,
        gy: sum_upper.gy / rawData.length,
        gz: sum_upper.gz / rawData.length,
        temp: sum_upper.temp / rawData.length,
      },
      avg_lower: {
        ax: sum_lower.ax / rawData.length,
        ay: sum_lower.ay / rawData.length,
        az: sum_lower.az / rawData.length,
        gx: sum_lower.gx / rawData.length,
        gy: sum_lower.gy / rawData.length,
        gz: sum_lower.gz / rawData.length,
        temp: sum_lower.temp / rawData.length,
      },
      avg_knee_angle: sum_angle / rawData.length,
    });

    await avgData.save();
    await RawSensorData.deleteMany({ _id: { $in: rawData.map((d) => d._id) } });
    console.log(`Saved 5-min average & deleted ${rawData.length} raw entries`);
  }
}, 5*60*1000);

module.exports = router;
