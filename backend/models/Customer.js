const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], trim: true },
    medicalHistory: [{
      condition: { type: String, trim: true },
      diagnosedDate: { type: Date },
      status: { type: String, enum: ['Active', 'Resolved', 'Chronic'], default: 'Active' }
    }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

customerSchema.methods.validatePassword = async function (passwordPlain) {
  return bcrypt.compare(passwordPlain, this.passwordHash);
};

customerSchema.statics.hashPassword = async function (passwordPlain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(passwordPlain, salt);
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
