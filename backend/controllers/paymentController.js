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
    const user = await User.findById(userId).select('name username fullname')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userName = user.fullname || user.name || user.username || 'Unknown User'

    // Get cart items
    const cartItems = await CartItem.find({ userId })
    
    // For demo: if no cart items, create a demo transaction
    if (cartItems.length === 0) {
      await Transaction.create({
        farmerId: userId,
        farmerName: userName,
        transactionId,
        type: 'purchase',
        description: 'Demo payment - no items',
        amount: 0,
        paymentMethod,
        status: 'completed',
        relatedItems: []
      })
      
      return res.json({
        message: 'Payment completed successfully (Demo)',
        transactionId,
        totalAmount: 0,
        status: 'completed'
      })
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0)

    // Create ItemBought records one by one to avoid conflicts
    for (const item of cartItems) {
      await ItemBought.create({
        userId,
        farmerName: userName,
        crop: item.crop,
        company: item.company,
        pricePerUnit: item.pricePerUnit,
        quantity: item.quantity,
        totalAmount: item.pricePerUnit * item.quantity,
        imageUrl: item.imageUrl,
        transactionId: `${transactionId}_${item._id}`, // Unique transaction ID per item
        paymentMethod
      })
    }

    // Create transaction record
    const relatedItems = cartItems.map(item => ({
      itemName: `${item.crop} - ${item.company}`,
      quantity: item.quantity,
      pricePerUnit: item.pricePerUnit
    }))

    await Transaction.create({
      farmerId: userId,
      farmerName: userName,
      transactionId,
      type: 'purchase',
      description: `Purchase of ${cartItems.length} items`,
      amount: totalAmount,
      paymentMethod,
      status: 'completed',
      relatedItems
    })

    // Clear cart after successful payment
    await CartItem.deleteMany({ userId })

    return res.json({
      message: 'Payment completed successfully',
      transactionId,
      totalAmount,
      status: 'completed'
    })

  } catch (err) {
    console.error('Payment completion error:', err)
    return res.status(500).json({ error: 'Payment processing failed' })
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
