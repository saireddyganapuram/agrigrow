const mongoose = require('mongoose')

const cattleSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true, trim: true },
    animalType: { 
      type: String, 
      required: true, 
      enum: ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Pig', 'Chicken', 'Duck', 'Horse', 'Camel', 'Other'],
      trim: true 
    },
    breed: { type: String, trim: true },
    count: { type: Number, required: true, min: 1, default: 1 },
    age: { type: String, trim: true }, // e.g., "2 years", "6 months"
    healthStatus: { 
      type: String, 
      enum: ['Healthy', 'Sick', 'Under Treatment', 'Vaccinated'], 
      default: 'Healthy' 
    },
    purpose: { 
      type: String, 
      enum: ['Milk', 'Meat', 'Breeding', 'Work', 'Eggs', 'Wool', 'Multiple'], 
      trim: true 
    },
    notes: { type: String, trim: true },
    lastVaccinated: { type: Date },
    acquisitionDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

const Cattle = mongoose.model('Cattle', cattleSchema)
module.exports = Cattle