const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true }, // Keeping for backward compatibility
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.validatePassword = async function (passwordPlain) {
  return bcrypt.compare(passwordPlain, this.passwordHash);
};

userSchema.statics.hashPassword = async function (passwordPlain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(passwordPlain, salt);
};

const User = mongoose.model('User', userSchema);

module.exports = User;


