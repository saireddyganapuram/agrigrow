const CartItem = require('../models/CartItem')

exports.addItem = async (req, res) => {
  try {
    const userId = req.user?.id
    const { crop, company, pricePerUnit, quantity, imageUrl } = req.body
    if (!crop || !company || !pricePerUnit || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const item = await CartItem.create({ userId, crop, company, pricePerUnit, quantity, imageUrl })
    return res.status(201).json({ item })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to add to cart' })
  }
}

exports.listItems = async (req, res) => {
  try {
    const userId = req.user?.id
    const items = await CartItem.find({ userId }).sort({ createdAt: -1 }).lean()
    return res.json({ items })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to load cart' })
  }
}

exports.removeItem = async (req, res) => {
  try {
    const userId = req.user?.id
    const { id } = req.params
    const item = await CartItem.findOneAndDelete({ _id: id, userId })
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    return res.json({ message: 'Item removed from cart' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to remove item' })
  }
}


