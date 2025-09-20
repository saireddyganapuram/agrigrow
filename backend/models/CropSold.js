const mongoose = require('mongoose')

const cropSoldSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true, trim: true },
    crop: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    pricePerUnit: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    transactionId: { type: String, required: true, unique: true },
    paymentMethod: { type: String, required: true, enum: ['card', 'upi', 'netbanking'] },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    saleDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

const CropSold = mongoose.model('CropSold', cropSoldSchema)
module.exports = CropSold
