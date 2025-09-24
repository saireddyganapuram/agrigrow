const Cattle = require('../models/Cattle')
const User = require('../models/User')

exports.addCattle = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const { animalType, breed, count, age, healthStatus, purpose, notes, lastVaccinated } = req.body

    if (!animalType || !count) {
      return res.status(400).json({ error: 'Animal type and count are required' })
    }

    // Get farmer name
    const farmer = await User.findById(farmerId).select('fullname name username')
    const farmerName = farmer?.fullname || farmer?.name || farmer?.username || 'Unknown Farmer'

    const cattle = await Cattle.create({
      farmerId,
      farmerName,
      animalType,
      breed,
      count,
      age,
      healthStatus,
      purpose,
      notes,
      lastVaccinated
    })

    return res.status(201).json({ cattle })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to add cattle' })
  }
}

exports.getCattleByFarmer = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const cattle = await Cattle.find({ farmerId }).sort({ createdAt: -1 }).lean()
    return res.json({ cattle })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch cattle' })
  }
}

exports.updateCattle = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const { id } = req.params
    const updateData = req.body

    const cattle = await Cattle.findOneAndUpdate(
      { _id: id, farmerId },
      updateData,
      { new: true }
    )

    if (!cattle) {
      return res.status(404).json({ error: 'Cattle record not found' })
    }

    return res.json({ cattle })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to update cattle' })
  }
}

exports.deleteCattle = async (req, res) => {
  try {
    const farmerId = req.user?.id
    const { id } = req.params

    const cattle = await Cattle.findOneAndDelete({ _id: id, farmerId })

    if (!cattle) {
      return res.status(404).json({ error: 'Cattle record not found' })
    }

    return res.json({ message: 'Cattle record deleted successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to delete cattle' })
  }
}