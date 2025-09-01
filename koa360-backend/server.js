const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const sensorRoutes = require("./routes/sensor");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb+srv://admin:admin123@cluster0.9wqyyos.mongodb.net/koa360", 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/", authRoutes);
app.use("/", sensorRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
