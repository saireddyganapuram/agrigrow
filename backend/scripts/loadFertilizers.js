/* eslint-disable no-console */
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const { connectToDatabase } = require('../config/db')
const Fertilizer = require('../models/Fertilizer')

const fertilizersPayload = [
  {
    "crop": "Paddy (Rice)",
    "fertilizers": [
      { "name": "Urea", "companies": ["IFFCO", "Kribhco"] },
      { "name": "DAP", "companies": ["Coromandel", "Zuari Agro"] },
      { "name": "MOP", "companies": ["Tata Chemicals", "Chambal Fertilizers"] },
      { "name": "Zinc Sulphate", "companies": ["Aries Agro", "Indofil"] }
    ]
  },
  {
    "crop": "Wheat",
    "fertilizers": [
      { "name": "Urea", "companies": ["IFFCO", "NFL"] },
      { "name": "DAP", "companies": ["Coromandel", "Zuari Agro"] },
      { "name": "SSP", "companies": ["Paras", "Rama Phosphates"] },
      { "name": "Potash", "companies": ["Tata Chemicals", "Chambal Fertilizers"] }
    ]
  },
  {
    "crop": "Maize (Corn)",
    "fertilizers": [
      { "name": "Urea", "companies": ["IFFCO", "Kribhco"] },
      { "name": "DAP", "companies": ["Chambal Fertilizers", "Coromandel"] },
      { "name": "Potash", "companies": ["Tata Chemicals", "Indian Potash Limited"] },
      { "name": "Boron Fertilizer", "companies": ["Aries Agro", "Nagarjuna Fertilizers"] }
    ]
  },
  {
    "crop": "Bajra (Pearl Millet)",
    "fertilizers": [
      { "name": "Urea", "companies": ["NFL", "IFFCO"] },
      { "name": "SSP", "companies": ["Rama Phosphates", "Paras"] },
      { "name": "Potash", "companies": ["Indian Potash Limited", "Tata Chemicals"] },
      { "name": "Zinc Sulphate", "companies": ["Aries Agro", "Indofil"] }
    ]
  },
  {
    "crop": "Jowar (Sorghum)",
    "fertilizers": [
      { "name": "Urea", "companies": ["IFFCO", "Kribhco"] },
      { "name": "DAP", "companies": ["Coromandel", "Zuari"] },
      { "name": "Potash", "companies": ["Chambal", "Indian Potash Limited"] },
      { "name": "Iron Sulphate", "companies": ["Aries Agro", "Indofil"] }
    ]
  },
  {
    "crop": "Barley",
    "fertilizers": [
      { "name": "Urea", "companies": ["NFL", "Kribhco"] },
      { "name": "SSP", "companies": ["Rama Phosphates", "Paras"] },
      { "name": "DAP", "companies": ["Zuari", "Coromandel"] },
      { "name": "Potash", "companies": ["Tata Chemicals", "Chambal"] }
    ]
  }
]

async function main() {
  await connectToDatabase()
  console.log('Seeding fertilizers collection...')

  // Upsert by crop to avoid duplicates on repeated runs
  for (const item of fertilizersPayload) {
    await Fertilizer.findOneAndUpdate(
      { crop: item.crop },
      { $set: { fertilizers: item.fertilizers } },
      { upsert: true, new: true }
    )
  }

  const count = await Fertilizer.countDocuments()
  console.log(`Completed. Total Fertilizer crops: ${count}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
