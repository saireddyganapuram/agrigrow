import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

import DoctorsList from '../components/DoctorsList';

function LeftPanel({ activeSection, setActiveSection, isOpen, onClose, onNavigation }) {
  const menuItems = [
    { id: 'home', label: 'Add Animals', icon: '🐄' },
    { id: 'history', label: 'View Records', icon: '📋' },
    { id: 'doctors', label: 'Veterinarians', icon: '👨‍⚕️' }
  ]

  return (
    <div className={`fixed left-0 top-0 h-full w-72 z-30 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="bg-white/90 backdrop-blur-lg border-r border-agri-200 h-full p-6 shadow-xl z-40">
        <div className="mb-10 pt-4">
        <h2 className="text-2xl font-bold text-agri-900">Cattle</h2>
      </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigation(item.id)
                if (window.innerWidth < 768) onClose()
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 rounded-lg ${
                activeSection === item.id
                  ? 'text-agri-900 font-semibold bg-agri-200/80'
                  : 'text-agri-700 hover:bg-agri-100/60 hover:text-agri-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

function CattleForm({ onSubmit }) {
  const [animals, setAnimals] = useState([
    { type: '', age: '', id: Date.now() }
  ])

  const animalTypes = [
    { value: 'cow', label: 'Cow 🐄' },
    { value: 'buffalo', label: 'Buffalo 🐃' },
    { value: 'sheep', label: 'Sheep 🐑' },
    { value: 'goat', label: 'Goat 🐐' }
  ]

  const handleAnimalChange = (index, field, value) => {
    const updatedAnimals = [...animals]
    updatedAnimals[index][field] = value
    setAnimals(updatedAnimals)
  }

  const addAnimal = () => {
    setAnimals([...animals, { type: '', age: '', id: Date.now() }])
  }

  const removeAnimal = (index) => {
    if (animals.length > 1) {
      setAnimals(animals.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate that all animals have type and age
    const validAnimals = animals.filter(animal => animal.type && animal.age)
    if (validAnimals.length === 0) {
      alert('Please add at least one animal with type and age')
      return
    }

    const farmerName = JSON.parse(localStorage.getItem('user') || '{}').name || 'Unknown Farmer'
    const cattleData = {
      animals: validAnimals,
      farmerName,
      date: new Date().toISOString(),
      id: Date.now().toString()
    }
    onSubmit(cattleData)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-agri-900 mb-6">Add Cattle Information</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {animals.map((animal, index) => (
            <div key={animal.id} className="border border-agri-200 rounded-lg p-4 bg-agri-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-agri-900">Animal {index + 1}</h4>
                {animals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAnimal(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-agri-700 mb-2">
                    Animal Type
                  </label>
                  <select
                    value={animal.type}
                    onChange={(e) => handleAnimalChange(index, 'type', e.target.value)}
                    className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select animal type</option>
                    {animalTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-agri-700 mb-2">
                    Age (in months)
                  </label>
                  <input
                    type="number"
                    value={animal.age}
                    onChange={(e) => handleAnimalChange(index, 'age', e.target.value)}
                    className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                    placeholder="Enter age in months"
                    min="0"
                    max="600"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addAnimal}
          className="w-full bg-agri-100 text-agri-700 py-3 px-6 rounded-lg font-medium hover:bg-agri-200 transition-colors border-2 border-dashed border-agri-300"
        >
          ➕ Add Another Animal
        </button>

        <button
          type="submit"
          className="w-full bg-agri-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-agri-700 transition-colors"
        >
          Save Cattle Information
        </button>
      </form>
    </div>
  )
}

function CattleEditView({ cattleData, onRemoveAnimal, onBackToForm, onNavigateToHistory }) {
  const getAnimalIcon = (type) => {
    switch(type) {
      case 'cow': return '🐄'
      case 'buffalo': return '🐃'
      case 'sheep': return '🐑'
      case 'goat': return '🐐'
      default: return '🐾'
    }
  }

  const getAnimalLabel = (type) => {
    switch(type) {
      case 'cow': return 'Cow'
      case 'buffalo': return 'Buffalo'
      case 'sheep': return 'Sheep'
      case 'goat': return 'Goat'
      default: return 'Animal'
    }
  }

  const formatAge = (months) => {
    if (months < 1) return `${months} month${months !== 1 ? 's' : ''}`
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`

    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
    }
  }

  if (!cattleData || !cattleData.animals) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-agri-900 mb-4">No Animals Found</h3>
          <p className="text-agri-700 mb-6">You haven't added any animals yet.</p>
          <button
            onClick={onBackToForm}
            className="bg-agri-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-agri-700 transition-colors"
          >
            ➕ Add Your First Animals
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-agri-900">Edit Cattle Records</h3>
        <div className="flex gap-3">
          <button
            onClick={onNavigateToHistory}
            className="bg-agri-100 text-agri-700 px-4 py-2 rounded-lg hover:bg-agri-200 transition-colors"
          >
            📊 View Summary
          </button>
          <button
            onClick={onBackToForm}
            className="bg-agri-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-agri-700 transition-colors"
          >
            ➕ Add More Animals
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {Object.entries(cattleData.animals.reduce((acc, animal) => {
          acc[animal.type] = (acc[animal.type] || 0) + 1
          return acc
        }, {})).map(([type, count]) => (
          <div key={type} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{getAnimalIcon(type)}</span>
              <div>
                <p className="font-medium text-agri-900 text-lg">{getAnimalLabel(type)}</p>
                <p className="text-3xl font-bold text-agri-700">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Count */}
      <div className="bg-agri-100 p-6 rounded-lg mb-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">📊</span>
          <div>
            <p className="font-medium text-agri-900 text-xl">Total Animals</p>
            <p className="text-4xl font-bold text-agri-700">{cattleData.animals.length}</p>
          </div>
        </div>
      </div>

      {/* Individual Animal Cards */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-semibold text-agri-900">Your Animals</h4>
          <p className="text-agri-600">Click remove to delete individual animals</p>
        </div>
        <div className="grid gap-4">
          {cattleData.animals.map((animal, index) => (
            <div key={index} className="flex items-center justify-between bg-agri-50 p-6 rounded-lg border-l-4 border-agri-500 hover:bg-agri-100 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getAnimalIcon(animal.type)}</span>
                <div>
                  <p className="font-semibold text-agri-900 text-lg">{getAnimalLabel(animal.type)}</p>
                  <p className="text-agri-600">Age: {formatAge(parseInt(animal.age))}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-agri-500">#{index + 1}</span>
                <button
                  onClick={() => onRemoveAnimal(index)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                  title="Remove this animal"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-agri-200">
        <div className="flex items-center justify-between text-sm text-agri-600">
          <span>Farmer: {cattleData.farmerName}</span>
          <span>Date: {new Date(cattleData.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

function CattleDataDisplay({ cattleData, onEdit }) {
  const getAnimalIcon = (type) => {
    switch(type) {
      case 'cow': return '🐄'
      case 'buffalo': return '🐃'
      case 'sheep': return '🐑'
      case 'goat': return '🐐'
      default: return '🐾'
    }
  }

  const getAnimalLabel = (type) => {
    switch(type) {
      case 'cow': return 'Cow'
      case 'buffalo': return 'Buffalo'
      case 'sheep': return 'Sheep'
      case 'goat': return 'Goat'
      default: return 'Animal'
    }
  }

  const formatAge = (months) => {
    if (months < 1) return `${months} month${months !== 1 ? 's' : ''}`
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`

    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
    }
  }

  // Group animals by type for summary
  const animalSummary = cattleData.animals.reduce((acc, animal) => {
    acc[animal.type] = (acc[animal.type] || 0) + 1
    return acc
  }, {})

  const totalAnimals = cattleData.animals.length

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-agri-900">Cattle Information</h3>
        <button
          onClick={() => onEdit('edit')}
          className="bg-agri-100 text-agri-700 px-4 py-2 rounded-lg hover:bg-agri-200 transition-colors"
        >
          ✏️ Edit
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {Object.entries(animalSummary).map(([type, count]) => (
          <div key={type} className="bg-agri-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getAnimalIcon(type)}</span>
              <div>
                <p className="font-medium text-agri-900">{getAnimalLabel(type)}</p>
                <p className="text-2xl font-bold text-agri-700">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Count */}
      <div className="bg-agri-100 p-6 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <p className="font-medium text-agri-900">Total Animals</p>
            <p className="text-3xl font-bold text-agri-700">{totalAnimals}</p>
          </div>
        </div>
      </div>

      {/* Detailed Animal List */}
      <div className="border-t border-agri-200 pt-6">
        <h4 className="text-lg font-semibold text-agri-900 mb-4">Animal Details</h4>
        <div className="grid gap-3">
          {cattleData.animals.map((animal, index) => (
            <div key={index} className="flex items-center justify-between bg-agri-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">{getAnimalIcon(animal.type)}</span>
                <div>
                  <p className="font-medium text-agri-900">{getAnimalLabel(animal.type)}</p>
                  <p className="text-sm text-agri-600">Age: {formatAge(parseInt(animal.age))}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-agri-600">#{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-agri-200">
        <div className="flex items-center justify-between text-sm text-agri-600">
          <span>Farmer: {cattleData.farmerName}</span>
          <span>Date: {new Date(cattleData.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

function Cattle() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('home')
  const [showForm, setShowForm] = useState(true)
  const [cattleData, setCattleData] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleFormSubmit = (data) => {
    setCattleData(data)
    setShowForm(false)
    // Store in localStorage for persistence
    const existingData = JSON.parse(localStorage.getItem('cattleData') || '[]')
    const updatedData = [...existingData, data]
    localStorage.setItem('cattleData', JSON.stringify(updatedData))

    // Navigate to history page after saving
    navigate('/cattle-history')
  }

  const handleNavigation = (section) => {
    if (section === 'edit') {
      setEditMode(true)
      setShowForm(false)
      setActiveSection('edit')
    } else if (section === 'home') {
      setShowForm(true)
      setEditMode(false)
      setActiveSection(section)
    } else if (section === 'doctors') {
      setShowForm(false)
      setEditMode(false)
      setActiveSection(section)
    } else {
      setActiveSection(section)
    }
  }

  const handleEdit = (section) => {
    if (section === 'edit') {
      setEditMode(true)
      setShowForm(false)
      setActiveSection('edit')
    } else if (section === 'history') {
      navigate('/cattle-history')
    } else if (section === 'doctors') {
      setEditMode(false)
      setShowForm(false)
      setActiveSection('doctors')
    } else if (section === 'home') {
      setEditMode(false)
      setShowForm(true)
      setActiveSection('home')
    }
    // Close the panel after selection
    setIsPanelOpen(false)
  }

  const handleRemoveAnimal = (animalIndex) => {
    if (!cattleData) return

    const updatedAnimals = cattleData.animals.filter((_, index) => index !== animalIndex)
    const updatedData = {
      ...cattleData,
      animals: updatedAnimals
    }

    setCattleData(updatedData)

    // Update localStorage
    const existingData = JSON.parse(localStorage.getItem('cattleData') || '[]')
    const dataIndex = existingData.findIndex(item => item.id === cattleData.id)
    if (dataIndex !== -1) {
      existingData[dataIndex] = updatedData
      localStorage.setItem('cattleData', JSON.stringify(existingData))
    }
  }

  const handleBackToForm = () => {
    setEditMode(false)
    setShowForm(true)
    setActiveSection('home')
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  // Load existing data on component mount
  useEffect(() => {
    const existingData = JSON.parse(localStorage.getItem('cattleData') || '[]')
    if (existingData.length > 0) {
      const latestData = existingData[existingData.length - 1]

      // Check if data is in old format (has cows, buffaloes, etc.) or new format (has animals array)
      if (latestData.animals) {
        setCattleData(latestData)
      } else {
        // Convert old format to new format for backward compatibility
        const convertedAnimals = []
        if (latestData.cows) convertedAnimals.push(...Array(parseInt(latestData.cows)).fill({ type: 'cow', age: '' }))
        if (latestData.buffaloes) convertedAnimals.push(...Array(parseInt(latestData.buffaloes)).fill({ type: 'buffalo', age: '' }))
        if (latestData.sheep) convertedAnimals.push(...Array(parseInt(latestData.sheep)).fill({ type: 'sheep', age: '' }))
        if (latestData.goats) convertedAnimals.push(...Array(parseInt(latestData.goats)).fill({ type: 'goat', age: '' }))

        if (convertedAnimals.length > 0) {
          const convertedData = {
            ...latestData,
            animals: convertedAnimals
          }
          setCattleData(convertedData)
        }
      }
      setShowForm(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 transition-all duration-300">
      {/* Blur overlay when panel is open */}
      {isPanelOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20" onClick={() => setIsPanelOpen(false)} />
      )}
      <header className="bg-white shadow-sm border-b border-agri-200 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="text-agri-700 hover:text-agri-900 p-2 rounded-md hover:bg-agri-100 flex items-center gap-2"
            >
              <span className="text-xl">☰</span>
              <span className="text-sm font-medium">Menu</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="AgriGrow" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-agri-900">AgriGrow</h1>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-16 relative">
        <LeftPanel
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onNavigation={handleEdit}
        />

        <main className={`flex-1 transition-all duration-300 ${isPanelOpen ? 'md:ml-72' : 'ml-0'} p-6 md:p-8 overflow-y-auto`}>
          {activeSection === 'doctors' ? (
            <DoctorsList token={token} />
          ) : editMode ? (
            <CattleEditView
              cattleData={cattleData}
              onRemoveAnimal={handleRemoveAnimal}
              onBackToForm={handleBackToForm}
              onNavigateToHistory={() => navigate('/cattle-history')}
            />
          ) : showForm ? (
            <CattleForm onSubmit={handleFormSubmit} />
          ) : (
            cattleData && <CattleDataDisplay cattleData={cattleData} onEdit={handleEdit} />
          )}
        </main>
      </div>
    </div>
  )
}

export default Cattle
