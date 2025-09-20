const mongoose = require('mongoose')

const fertilizerSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, trim: true },
    fertilizers: [{
      name: { type: String, required: true, trim: true },
      companies: [{ type: String, required: true, trim: true }]
    }]
  },
  { timestamps: true }
)

const Fertilizer = mongoose.model('Fertilizer', fertilizerSchema)
module.exports = Fertilizer
