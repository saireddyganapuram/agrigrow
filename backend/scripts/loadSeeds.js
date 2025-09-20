/* eslint-disable no-console */
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const { connectToDatabase } = require('../config/db')
const Seed = require('../models/Seed')

const seedsPayload = [
  { company_name: 'Nuziveedu Seeds', category: 'Real', seeds: ['Paddy (Rice)', 'Cotton', 'Maize (Corn)', 'Bajra (Pearl Millet)'] },
  { company_name: 'Kaveri Seed Company', category: 'Real', seeds: ['Cotton', 'Maize (Corn)', 'Sunflower', 'Tomato', 'Chilli'] },
  { company_name: 'Rasi Seeds', category: 'Real', seeds: ['Cotton', 'Maize (Corn)', 'Paddy (Rice)'] },
  { company_name: 'Mahyco (Maharashtra Hybrid Seeds Company)', category: 'Real', seeds: ['Tomato', 'Okra (Lady Finger)', 'Brinjal (Eggplant)', 'Cotton'] },
  { company_name: 'Advanta Seeds', category: 'Real', seeds: ['Sorghum (Jowar)', 'Bajra (Pearl Millet)', 'Sunflower', 'Maize (Corn)'] },
  { company_name: 'Bayer Crop Science', category: 'Real', seeds: ['Tomato', 'Onion', 'Cabbage', 'Cauliflower', 'Cotton', 'Maize (Corn)'] },
  { company_name: 'Syngenta India', category: 'Real', seeds: ['Paddy (Rice)', 'Corn', 'Tomato', 'Cabbage', 'Cauliflower'] },
  { company_name: 'DuPont Pioneer', category: 'Real', seeds: ['Maize (Corn)', 'Sorghum (Jowar)', 'Soybean'] },
  { company_name: 'Namdhari Seeds', category: 'Real', seeds: ['Tomato', 'Cucumber', 'Watermelon', 'Muskmelon', 'Chilli'] },
  { company_name: 'Ankur Seeds', category: 'Real', seeds: ['Cotton', 'Maize (Corn)', 'Soybean', 'Bajra (Pearl Millet)'] },
  { company_name: 'GreenHarvest Seeds Pvt. Ltd.', category: 'Dummy', seeds: ['Wheat', 'Paddy (Rice)', 'Tomato'] },
  { company_name: 'AgroGrow Seeds & Fertilizers', category: 'Dummy', seeds: ['Brinjal (Eggplant)', 'Okra (Lady Finger)', 'Maize (Corn)'] },
  { company_name: 'FreshField Agro Seeds', category: 'Dummy', seeds: ['Carrot', 'Onion', 'Spinach'] },
  { company_name: 'CropCare Genetics', category: 'Dummy', seeds: ['Paddy (Rice)', 'Bajra (Pearl Millet)', 'Sorghum (Jowar)'] },
  { company_name: 'PureYield Seeds Company', category: 'Dummy', seeds: ['Papaya', 'Mango Saplings', 'Guava Saplings'] },
  { company_name: 'AgriNova Seeds Ltd.', category: 'Dummy', seeds: ['Tomato', 'Cabbage', 'Cauliflower'] },
  { company_name: 'BharatAgro Hybrid Seeds', category: 'Dummy', seeds: ['Paddy (Rice)', 'Maize (Corn)', 'Wheat'] },
  { company_name: 'EcoSprout Seeds & Saplings', category: 'Dummy', seeds: ['Banana Tissue Culture Saplings', 'Watermelon', 'Muskmelon'] },
  { company_name: 'SeedSmart India Pvt. Ltd.', category: 'Dummy', seeds: ['Rose Saplings', 'Sunflower', 'Marigold'] },
  { company_name: 'GoldenCrop Agro Solutions', category: 'Dummy', seeds: ['Paddy (Rice)', 'Cotton', 'Chilli'] },
]

async function main() {
  await connectToDatabase()
  console.log('Seeding seeds collection...')

  // Upsert by company_name to avoid duplicates on repeated runs
  for (const item of seedsPayload) {
    await Seed.findOneAndUpdate(
      { company_name: item.company_name },
      { $set: { category: item.category, seeds: item.seeds } },
      { upsert: true, new: true }
    )
  }

  const count = await Seed.countDocuments()
  console.log(`Completed. Total Seed companies: ${count}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


