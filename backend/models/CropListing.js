const mongoose = require('mongoose')

const cropListingSchema = new mongoose.Schema(
  {
    farmerName: { type: String, required: true, trim: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cropName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, trim: true, default: 'kg' },
    description: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
)

const CropListing = mongoose.model('CropListing', cropListingSchema)
module.exports = CropListing
