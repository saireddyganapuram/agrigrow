const Transaction = require('../models/Transaction')
const ItemBought = require('../models/ItemBought')
const CropSold = require('../models/CropSold')

exports.getTransactions = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const transactions = await Transaction.find({ farmerId }).sort({ transactionDate: -1 }).lean()
    return res.json({ transactions })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch transactions' })
  }
}

exports.createTransaction = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const { type, description, amount, paymentMethod, relatedItems, notes } = req.body
    
    if (!type || !description || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    
    // Get farmer name
    const User = require('../models/User')
    const user = await User.findById(farmerId).select('name username')
    const farmerName = user?.name || user?.username || 'Unknown Farmer'

    const transaction = await Transaction.create({
      farmerId,
      farmerName,
      transactionId,
      type,
      description,
      amount,
      paymentMethod,
      relatedItems: relatedItems || [],
      notes
    })

    return res.status(201).json({ transaction })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to create transaction' })
  }
}

exports.getTransactionSummary = async (req, res) => {
  try {
    const farmerId = req.user?.id
    
    // Get purchase history
    const purchases = await ItemBought.find({ userId: farmerId }).lean()
    const totalPurchases = purchases.reduce((sum, item) => sum + item.totalAmount, 0)
    
    // Get sales history (if any)
    const sales = await CropSold.find({ farmerId }).lean()
    const totalSales = sales.reduce((sum, item) => sum + item.totalAmount, 0)
    
    // Get all transactions
    const transactions = await Transaction.find({ farmerId }).lean()
    
    // Calculate summary
    const summary = {
      totalTransactions: transactions.length,
      totalPurchases: totalPurchases,
      totalSales: totalSales,
      netAmount: totalSales - totalPurchases,
      recentTransactions: transactions.slice(0, 5), // Last 5 transactions
      purchaseCount: purchases.length,
      salesCount: sales.length
    }

    return res.json({ summary })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch transaction summary' })
  }
}
