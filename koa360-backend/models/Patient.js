const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PatientSchema = new mongoose.Schema({
  patientNo: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  doctorRegNo: { type: String, required: true } 
});

// Hash password before saving
PatientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Patient", PatientSchema);
