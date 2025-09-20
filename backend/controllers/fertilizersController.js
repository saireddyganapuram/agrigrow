const Fertilizer = require('../models/Fertilizer')

exports.listFertilizers = async (req, res) => {
  try {
    const { crop } = req.query
    const query = crop ? { crop: { $regex: new RegExp(crop, 'i') } } : {}
    const items = await Fertilizer.find(query).lean()
    return res.json({ items })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch fertilizers' })
  }
}
