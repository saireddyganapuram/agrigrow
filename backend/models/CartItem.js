const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crop: { type: String, required: true },
    company: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    imageUrl: { type: String },
  },
  { timestamps: true }
)

const CartItem = mongoose.model('CartItem', cartItemSchema)
module.exports = CartItem


