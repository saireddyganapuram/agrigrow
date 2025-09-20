const CartItem = require('../models/CartItem')
const ItemBought = require('../models/ItemBought')
const CropSold = require('../models/CropSold')
const Transaction = require('../models/Transaction')
const User = require('../models/User')

exports.completePayment = async (req, res) => {
  try {
    const userId = req.user?.id
    const { paymentMethod, transactionId } = req.body
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    // Get user details
    const user = await User.findById(userId).select('name username')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get all cart items for the user
    const cartItems = await CartItem.find({ userId })
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    const boughtItems = []

    // Process each cart item - only add to Items Bought list
    for (const item of cartItems) {
      const totalAmount = item.quantity * item.pricePerUnit
      const uniqueTransactionId = `${transactionId}_${item._id}`

      // Add to ItemBought (buyer's purchase history)
      const boughtItem = await ItemBought.create({
        userId,
        farmerName: 'AgriGrow Store', // Since these are from store, not individual farmers
        crop: item.crop,
        company: item.company,
        pricePerUnit: item.pricePerUnit,
        quantity: item.quantity,
        totalAmount,
        imageUrl: item.imageUrl,
        transactionId: uniqueTransactionId,
        paymentMethod
      })

      boughtItems.push(boughtItem)
    }

    // Create transaction record
    const totalAmount = boughtItems.reduce((sum, item) => sum + item.totalAmount, 0)
    const relatedItems = boughtItems.map(item => ({
      itemName: `${item.crop} - ${item.company}`,
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit
    }))

    await Transaction.create({
      farmerId: userId,
      farmerName: user.name || user.username || 'Unknown Farmer',
      transactionId,
      type: 'purchase',
      description: `Purchase of ${boughtItems.length} items from AgriGrow Store`,
      amount: totalAmount,
      paymentMethod,
      status: 'completed',
      relatedItems,
      notes: `Payment completed via ${paymentMethod}`
    })

    // Clear the cart after successful payment
    await CartItem.deleteMany({ userId })

    return res.json({
      message: 'Payment completed successfully',
      transactionId,
      boughtItems: boughtItems.length,
      totalAmount
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to complete payment' })
  }
}

exports.getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user?.id
    console.log('Fetching purchase history for userId:', userId)
    
    const items = await ItemBought.find({ userId }).sort({ purchaseDate: -1 }).lean()
    console.log('Found items:', items.length, items)
    
    return res.json({ items })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch purchase history' })
  }
}

exports.getSalesHistory = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const items = await CropSold.find({ farmerId }).sort({ saleDate: -1 }).lean()
    return res.json({ items })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch sales history' })
  }
}

exports.clearPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user?.id
    console.log('Clearing purchase history for userId:', userId)
    
    const result = await ItemBought.deleteMany({ userId })
    console.log('Deleted items:', result.deletedCount)
    
    return res.json({ message: `Cleared ${result.deletedCount} purchase records` })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to clear purchase history' })
  }
}
