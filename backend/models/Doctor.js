const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    qualification: { type: String, required: true, trim: true },
    specialization: { type: String, trim: true },
    experience: { type: Number, min: 0 },
    licenseNumber: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorSchema.methods.validatePassword = async function (passwordPlain) {
  return bcrypt.compare(passwordPlain, this.passwordHash);
};

doctorSchema.statics.hashPassword = async function (passwordPlain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(passwordPlain, salt);
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
