const CropListing = require('../models/CropListing')

exports.createListing = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const farmerName = req.user?.name || 'Unknown Farmer'
    const { cropName, price, quantity, unit, description } = req.body
    
    if (!cropName || !price || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const listing = await CropListing.create({
      farmerId,
      farmerName,
      cropName,
      price,
      quantity,
      unit: unit || 'kg',
      description
    })

    return res.status(201).json({ listing })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to create listing' })
  }
}

exports.getListings = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const listings = await CropListing.find({ farmerId }).sort({ createdAt: -1 }).lean()
    return res.json({ listings })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch listings' })
  }
}

exports.getAllListings = async (req, res) => {
  try {
    const listings = await CropListing.find({ isAvailable: true }).sort({ createdAt: -1 }).lean()
    return res.json({ listings })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch listings' })
  }
}

exports.deleteListing = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const { id } = req.params
    
    const listing = await CropListing.findOneAndDelete({ _id: id, farmerId })
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    
    return res.json({ message: 'Listing deleted successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to delete listing' })
  }
}
