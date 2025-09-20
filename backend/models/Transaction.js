const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true, trim: true },
    transactionId: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['purchase', 'sale', 'payment'], trim: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true, enum: ['card', 'upi', 'netbanking', 'cash'], trim: true },
    status: { type: String, required: true, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    relatedItems: [{
      itemName: { type: String, trim: true },
      quantity: { type: Number, min: 1 },
      pricePerUnit: { type: Number, min: 0 }
    }],
    notes: { type: String, trim: true },
    transactionDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction
