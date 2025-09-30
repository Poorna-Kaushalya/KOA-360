const express = require("express");
const jwt = require("jsonwebtoken");
const RawSensorData = require("../models/RawSensorData");
const AvgSensorData = require("../models/AvgSensorData");

const router = express.Router();
const JWT_SECRET = "your_secret_key";

// ----------------- Auth middleware -----------------
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// ----------------- Save raw sensor data -----------------
router.post("/api/sensor-data", async (req, res) => {
  try {
    // req.body should now contain ax, ay, az, gx, gy, gz
    const newData = new RawSensorData(req.body);
    await newData.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- Get latest 10 averages (protected) -----------------
router.get("/api/sensor-data", authMiddleware, async (req, res) => {
  const data = await AvgSensorData.find().sort({ createdAt: -1 }).limit(10);
  res.json(data);
});

// ----------------- Device status -----------------
router.get("/api/device-status", async (req, res) => {
  try {
    const latest = await RawSensorData.findOne().sort({ createdAt: -1 });
    if (!latest) return res.json({ connected: false });

    const now = Date.now();
    const diff = now - new Date(latest.createdAt).getTime();

    res.json({ connected: diff < 10000 }); // connected if <10 sec old
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Every 5 minutes calculate averages -----------------
setInterval(async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const rawData = await RawSensorData.find({
    createdAt: { $gte: fiveMinutesAgo },
  });

  if (rawData.length > 0) {
    const device_id = rawData[0].device_id;

    let sum_ax = 0, sum_ay = 0, sum_az = 0;
    let sum_gx = 0, sum_gy = 0, sum_gz = 0;

    rawData.forEach((d) => {
      sum_ax += d.ax;
      sum_ay += d.ay;
      sum_az += d.az;
      sum_gx += d.gx;
      sum_gy += d.gy;
      sum_gz += d.gz;
    });

    const avgData = new AvgSensorData({
      device_id,
      avg_ax: sum_ax / rawData.length,
      avg_ay: sum_ay / rawData.length,
      avg_az: sum_az / rawData.length,
      avg_gx: sum_gx / rawData.length,
      avg_gy: sum_gy / rawData.length,
      avg_gz: sum_gz / rawData.length,
    });

    await avgData.save();

    // clean up raw data
    await RawSensorData.deleteMany({ _id: { $in: rawData.map((d) => d._id) } });
    console.log(`Saved 5-min average & deleted ${rawData.length} raw entries`);
  }
}, 5 * 60 * 1000);

module.exports = router;
