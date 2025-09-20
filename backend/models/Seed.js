const mongoose = require('mongoose');

const seedSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Real', 'Dummy'], trim: true },
    seeds: { type: [String], required: true, default: [], validate: (arr) => Array.isArray(arr) && arr.length > 0 },
  },
  { timestamps: true }
);

const Seed = mongoose.model('Seed', seedSchema);

module.exports = Seed;


