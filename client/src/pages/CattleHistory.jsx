import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

function LeftPanel({ activeSection, setActiveSection, isOpen, onClose, onNavigation }) {
  const menuItems = [
    { id: 'home', label: 'Add Animals', icon: '➕' },
    { id: 'history', label: 'View Records', icon: '📊' },
    { id: 'edit', label: 'Edit', icon: '✏️' }
  ]

  return (
    <div className={`fixed left-0 top-0 h-full w-64 z-30 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 border border-agri-300 rounded-2xl shadow-2xl p-6 h-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-agri-900">Navigation</h2>
          <button
            onClick={onClose}
            className="text-agri-800 hover:text-agri-900 p-2 rounded-full hover:bg-agri-300 transition-all duration-200"
          >
            ✕
          </button>
        </div>
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigation(item.id)
                if (window.innerWidth < 768) onClose()
              }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                activeSection === item.id
                  ? 'bg-agri-100 text-agri-900 shadow-lg transform scale-105'
                  : 'text-agri-700 hover:text-agri-900 hover:bg-agri-50 hover:translate-x-2'
              }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && (
                <div className="ml-auto w-2 h-2 bg-agri-900 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-agri-50 to-transparent rounded-b-2xl"></div>
        <div className="absolute top-1/2 left-0 w-1 h-16 bg-agri-400 rounded-r-full -translate-y-1/2"></div>
      </div>
    </div>
  )
}

function CattleRecordsDisplay({ cattleData, onEdit, onAddNew }) {
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-agri-900">Cattle Records</h3>
        <button
          onClick={onAddNew}
          className="bg-agri-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-agri-700 transition-colors"
        >
          ➕ Add New Animals
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {Object.entries(animalSummary).map(([type, count]) => (
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
      <div className="bg-agri-100 p-8 rounded-lg mb-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">📊</span>
          <div>
            <p className="font-medium text-agri-900 text-xl">Total Animals</p>
            <p className="text-4xl font-bold text-agri-700">{totalAnimals}</p>
          </div>
        </div>
      </div>

      {/* Detailed Animal List */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-semibold text-agri-900">Animal Details</h4>
          <button
            onClick={() => onEdit('edit')}
            className="bg-agri-100 text-agri-700 px-4 py-2 rounded-lg hover:bg-agri-200 transition-colors"
          >
            ✏️ Edit Records
          </button>
        </div>
        <div className="grid gap-4">
          {cattleData.animals.map((animal, index) => (
            <div key={index} className="flex items-center justify-between bg-agri-50 p-6 rounded-lg border-l-4 border-agri-500">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{getAnimalIcon(animal.type)}</span>
                <div>
                  <p className="font-semibold text-agri-900 text-lg">{getAnimalLabel(animal.type)}</p>
                  <p className="text-agri-600">Age: {formatAge(parseInt(animal.age))}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-agri-600">Record #{index + 1}</p>
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

export default function CattleHistory() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('history')
  const [isPanelOpen, setIsPanelOpen] = useState(false) // Initially hidden
  const [cattleData, setCattleData] = useState(null)

  useEffect(() => {
    // Load existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem('cattleData') || '[]')
    if (existingData.length > 0) {
      const latestData = existingData[existingData.length - 1]
      setCattleData(latestData)
    } else {
      // If no data, redirect to cattle form
      navigate('/cattle')
    }
  }, [navigate])

  const handleNavigation = (section) => {
    if (section === 'home') {
      navigate('/cattle')
    } else if (section === 'edit') {
      navigate('/cattle')
    }
    setActiveSection(section)
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  if (!cattleData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-agri-900 mb-2">Loading Records...</h3>
          <p className="text-agri-700">Please wait while we fetch your cattle information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50">
      <header className="bg-white shadow-sm border-b border-agri-200">
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

      <div className="flex h-[calc(100vh-80px)] relative">
        <LeftPanel
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onNavigation={handleNavigation}
        />

        {/* Overlay when panel is open on mobile */}
        {isPanelOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden" onClick={() => setIsPanelOpen(false)} />
        )}

        <main className={`flex-1 transition-all duration-300 ${isPanelOpen ? 'md:ml-0' : 'ml-0'} p-8 overflow-y-auto`}>
          <CattleRecordsDisplay
            cattleData={cattleData}
            onEdit={handleNavigation}
            onAddNew={handleAddNew}
          />
        </main>
      </div>
    </div>
  )
}
