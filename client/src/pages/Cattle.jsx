import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCattle, addCattle, fetchDoctors, bookAppointment } from '../lib/api'
import logo from '../assets/agri-logo.png'

import DoctorsList from '../components/DoctorsList';

function BookAppointment({ doctor, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  })
  const [loading, setLoading] = useState(false)

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login first')
        return
      }
      
      await bookAppointment(doctor._id, formData, token)
      onSuccess('Appointment booked successfully!')
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-agri-900">Book Appointment</h3>
        <button onClick={onBack} className="text-agri-600 hover:text-agri-800">
          ← Back
        </button>
      </div>
      
      <div className="mb-6 p-4 bg-agri-50 rounded-lg">
        <h4 className="font-semibold text-agri-900">{doctor.fullname}</h4>
        <p className="text-agri-700">{doctor.qualification}</p>
        <p className="text-sm text-agri-600">{doctor.specialization}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-agri-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-agri-700 mb-2">Time</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            required
          >
            <option value="">Select time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-agri-700 mb-2">Reason for Visit</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            placeholder="Describe the reason for your appointment..."
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-agri-300 text-agri-700 rounded-lg hover:bg-agri-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-agri-600 text-white rounded-lg hover:bg-agri-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  )
}

function VeterinariansList({ onBookAppointment }) {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Please login first')
          return
        }
        
        setLoading(true)
        const response = await fetchDoctors(token)
        setDoctors(response.doctors || [])
      } catch (error) {
        console.error('Error loading doctors:', error)
        setError('Failed to load veterinarians')
      } finally {
        setLoading(false)
      }
    }

    loadDoctors()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agri-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-agri-900 mb-2">Error</h3>
        <p className="text-agri-700">{error}</p>
      </div>
    )
  }

  if (doctors.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">👨⚕️</div>
        <h3 className="text-2xl font-bold text-agri-900 mb-4">No Veterinarians Found</h3>
        <p className="text-agri-700">No veterinarians are currently available.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-agri-900">Available Veterinarians</h3>
        <p className="text-agri-700 mt-2">Find qualified veterinarians for your animals</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="bg-white rounded-lg shadow-lg p-6 border border-agri-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-agri-100 flex items-center justify-center">
                <span className="text-2xl">👨⚕️</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-agri-900">{doctor.fullname}</h4>
                <p className="text-sm text-agri-600">{doctor.qualification}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              {doctor.specialization && (
                <div className="flex justify-between">
                  <span className="text-agri-600">Specialization:</span>
                  <span className="text-agri-900">{doctor.specialization}</span>
                </div>
              )}
              {doctor.experience && (
                <div className="flex justify-between">
                  <span className="text-agri-600">Experience:</span>
                  <span className="text-agri-900">{doctor.experience} years</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-agri-600">Phone:</span>
                <span className="text-agri-900">{doctor.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-agri-600">Email:</span>
                <span className="text-agri-900 text-xs">{doctor.email}</span>
              </div>
              {doctor.licenseNumber && (
                <div className="flex justify-between">
                  <span className="text-agri-600">License:</span>
                  <span className="text-agri-900 text-xs">{doctor.licenseNumber}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-agri-100">
              <p className="text-xs text-agri-500">{doctor.address}</p>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => onBookAppointment(doctor)}
                className="w-full bg-agri-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-agri-700 transition-colors"
              >
                📅 Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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
  const [formData, setFormData] = useState({
    animalType: '',
    breed: '',
    count: 1,
    age: '',
    healthStatus: 'Healthy',
    purpose: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const animalTypes = [
    { value: 'Cow', label: 'Cow 🐄' },
    { value: 'Buffalo', label: 'Buffalo 🐃' },
    { value: 'Sheep', label: 'Sheep 🐑' },
    { value: 'Goat', label: 'Goat 🐐' },
    { value: 'Chicken', label: 'Chicken 🐔' },
    { value: 'Duck', label: 'Duck 🦆' }
  ]

  const purposes = [
    { value: 'Milk', label: 'Milk' },
    { value: 'Meat', label: 'Meat' },
    { value: 'Breeding', label: 'Breeding' },
    { value: 'Eggs', label: 'Eggs' },
    { value: 'Multiple', label: 'Multiple' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login first')
        return
      }
      
      await addCattle(formData, token)
      onSubmit('Animal added successfully!')
    } catch (error) {
      console.error('Error adding cattle:', error)
      alert('Failed to add animal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-agri-900 mb-6">Add Cattle Information</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-agri-700 mb-2">Animal Type</label>
            <select
              name="animalType"
              value={formData.animalType}
              onChange={handleChange}
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
            <label className="block text-sm font-medium text-agri-700 mb-2">Breed</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
              placeholder="Enter breed (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-agri-700 mb-2">Count</label>
            <input
              type="number"
              name="count"
              value={formData.count}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-agri-700 mb-2">Age</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
              placeholder="e.g., 2 years, 6 months"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-agri-700 mb-2">Purpose</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            >
              <option value="">Select purpose</option>
              {purposes.map((purpose) => (
                <option key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-agri-700 mb-2">Health Status</label>
            <select
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            >
              <option value="Healthy">Healthy</option>
              <option value="Sick">Sick</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Vaccinated">Vaccinated</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-agri-700 mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            placeholder="Additional notes (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            loading 
              ? 'bg-agri-300 text-agri-600 cursor-not-allowed' 
              : 'bg-agri-600 text-white hover:bg-agri-700'
          }`}
        >
          {loading ? 'Adding...' : 'Add Animal'}
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
  const [activeSection, setActiveSection] = useState('history')
  const [cattle, setCattle] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const displayName = user?.fullname || user?.name || 'Farmer'

  const loadCattle = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      
      setLoading(true)
      const response = await getCattle(token)
      setCattle(response.cattle || [])
    } catch (error) {
      console.error('Error loading cattle:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAnimal = (message) => {
    loadCattle() // Refresh the list after adding
    setActiveSection('history') // Go back to view records
    if (message) {
      // Show success message without alert
      const messageDiv = document.createElement('div')
      messageDiv.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
      messageDiv.textContent = message
      document.body.appendChild(messageDiv)
      setTimeout(() => {
        document.body.removeChild(messageDiv)
      }, 3000)
    }
  }

  const handleNavigation = (section) => {
    setActiveSection(section)
    setShowBookingForm(false)
    setSelectedDoctor(null)
  }

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor)
    setShowBookingForm(true)
  }

  const handleBackFromBooking = () => {
    setShowBookingForm(false)
    setSelectedDoctor(null)
  }

  const handleAppointmentSuccess = (message) => {
    setShowBookingForm(false)
    setSelectedDoctor(null)
    // Show success message
    const messageDiv = document.createElement('div')
    messageDiv.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
    messageDiv.textContent = message
    document.body.appendChild(messageDiv)
    setTimeout(() => {
      document.body.removeChild(messageDiv)
    }, 3000)
  }

  const getAnimalIcon = (type) => {
    switch(type) {
      case 'Cow': return '🐄'
      case 'Buffalo': return '🐃'
      case 'Sheep': return '🐑'
      case 'Goat': return '🐐'
      case 'Chicken': return '🐔'
      case 'Duck': return '🦆'
      default: return '🐾'
    }
  }

  const renderContent = () => {
    if (activeSection === 'home') {
      return <CattleForm onSubmit={handleAddAnimal} />
    }
    
    if (activeSection === 'doctors') {
      if (showBookingForm && selectedDoctor) {
        return (
          <BookAppointment 
            doctor={selectedDoctor}
            onBack={handleBackFromBooking}
            onSuccess={handleAppointmentSuccess}
          />
        )
      }
      return <VeterinariansList onBookAppointment={handleBookAppointment} />
    }
    
    // Default: history/records view
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agri-500"></div>
        </div>
      )
    }
    
    if (cattle.length === 0) {
      return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🐄</div>
          <h3 className="text-2xl font-bold text-agri-900 mb-4">No Animals Found</h3>
          <p className="text-agri-700 mb-6">You haven't added any animals yet. Start by adding your first animal.</p>
          <button
            onClick={() => setActiveSection('home')}
            className="bg-agri-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-agri-700 transition-colors"
          >
            ➕ Add Your First Animal
          </button>
        </div>
      )
    }
    
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-agri-900">Your Animals</h3>
          <button
            onClick={() => setActiveSection('home')}
            className="bg-agri-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-agri-700 transition-colors"
          >
            ➕ Add New Animal
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cattle.map((animal) => (
            <div key={animal._id} className="bg-white rounded-lg shadow-lg p-6 border border-agri-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getAnimalIcon(animal.animalType)}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-agri-900">{animal.animalType}</h4>
                    {animal.breed && <p className="text-sm text-agri-600">{animal.breed}</p>}
                  </div>
                </div>
                <span className="bg-agri-100 text-agri-800 px-2 py-1 rounded-full text-sm font-medium">
                  {animal.count} {animal.count === 1 ? 'animal' : 'animals'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                {animal.age && (
                  <div className="flex justify-between">
                    <span className="text-agri-600">Age:</span>
                    <span className="text-agri-900">{animal.age}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-agri-600">Health:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    animal.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                    animal.healthStatus === 'Sick' ? 'bg-red-100 text-red-800' :
                    animal.healthStatus === 'Under Treatment' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {animal.healthStatus}
                  </span>
                </div>
                {animal.purpose && (
                  <div className="flex justify-between">
                    <span className="text-agri-600">Purpose:</span>
                    <span className="text-agri-900">{animal.purpose}</span>
                  </div>
                )}
                {animal.notes && (
                  <div className="mt-3 pt-3 border-t border-agri-100">
                    <p className="text-agri-700 text-xs">{animal.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadCattle()
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
          onNavigation={handleNavigation}
        />

        <main className={`flex-1 transition-all duration-300 ${isPanelOpen ? 'md:ml-72' : 'ml-0'} p-6 md:p-8 overflow-y-auto`}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-agri-900">Cattle Management</h1>
            <p className="mt-2 text-agri-700">Manage your animals, {displayName}</p>
          </div>
          
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Cattle
