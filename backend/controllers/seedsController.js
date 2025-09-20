const Seed = require('../models/Seed')

exports.listSeeds = async (req, res) => {
  try {
    const { crop } = req.query
    const query = crop ? { seeds: { $elemMatch: { $regex: new RegExp(`^${crop}$`, 'i') } } } : {}
    const items = await Seed.find(query).lean()
    return res.json({ items })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch seeds' })
  }
}


