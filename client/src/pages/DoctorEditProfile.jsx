import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateDoctorProfile, request } from '../lib/api';
import logo from '../assets/agri-logo.png';

// Reusable PanelLink component
function PanelLink({ onClick, label, emoji }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-md hover:bg-agri-100 active:bg-agri-200 transition flex items-center gap-2 border-b border-agri-100 last:border-b-0"
    >
      <span className="text-lg" aria-hidden>{emoji}</span>
      <span className="font-medium text-agri-900">{label}</span>
    </button>
  );
}

const DoctorEditProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
  const displayName = user?.fullname || doctor?.fullname || 'Doctor';
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    specialization: '',
    experience: '',
    licenseNumber: ''
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('doctor');
    navigate('/login');
  };

  const goToDashboard = () => {
    navigate('/doctors/dashboard');
  };

  const goToAppointments = () => {
    navigate('/doctors/appointments');
  };

  useEffect(() => {
    // Load doctor data from localStorage or API
    const loadDoctorData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }

        // Try to fetch from API first
        try {
          const response = await request('/api/doctors/me', { token });
          const doctorData = response.doctor;
          localStorage.setItem('doctor', JSON.stringify(doctorData));
          setFormData({
            fullname: doctorData.fullname || '',
            email: doctorData.email || '',
            phone: doctorData.phone || '',
            address: doctorData.address || '',
            qualification: doctorData.qualification || '',
            specialization: doctorData.specialization || '',
            experience: doctorData.experience || '',
            licenseNumber: doctorData.licenseNumber || ''
          });
        } catch (apiError) {
          console.warn('Could not fetch doctor data from API, using local storage', apiError);
          // Fallback to localStorage if API call fails
          const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');
          if (doctor) {
            setFormData({
              fullname: doctor.fullname || '',
              email: doctor.email || '',
              phone: doctor.phone || '',
              address: doctor.address || '',
              qualification: doctor.qualification || '',
              specialization: doctor.specialization || '',
              experience: doctor.experience || '',
              licenseNumber: doctor.licenseNumber || ''
            });
          }
        }
      } catch (error) {
        console.error('Error loading doctor data:', error);
        alert(error.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctorData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editMode) {
      setEditMode(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Call the API to update the doctor's profile
      const response = await updateDoctorProfile(formData, token);
      const updatedDoctor = response.doctor;
      
      // Update local storage with the updated doctor data
      localStorage.setItem('doctor', JSON.stringify(updatedDoctor));
      
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-agri-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-600 mx-auto"></div>
          <p className="mt-4 text-agri-800">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 text-agri-900">
      {/* Background Logo */}
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-[length:28rem] md:bg-[length:32rem] opacity-10"
        style={{ backgroundImage: `url(${logo})`, backgroundPosition: 'center 9rem' }}
        aria-hidden
      />
      
      {/* Top Navigation Bar */}
      <header className="border-b border-agri-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Profile Button */}
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 rounded-full border border-agri-400 bg-white/90 hover:bg-white text-agri-800 px-3 py-1.5 shadow"
              aria-label="Open profile panel"
            >
              <span className="text-xl">👨‍⚕️</span>
              <span className="font-medium hidden sm:block">Profile</span>
            </button>
          </div>
          
          <div className="flex items-center">
            {/* Logout Button */}
            <button 
              onClick={logout} 
              className="px-4 py-2 rounded-full border border-agri-400 bg-white hover:bg-agri-100 text-agri-800 text-base md:text-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-agri-600">
            <h3 className="text-lg font-medium text-white">Doctor Profile</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-agri-500 focus:border-agri-500"
                    required
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.fullname || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-agri-500 focus:border-agri-500"
                    required
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.email || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-agri-500 focus:border-agri-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.phone || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                {editMode ? (
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-agri-500 focus:border-agri-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.licenseNumber || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Qualification</label>
                {editMode ? (
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-agri-500 focus:border-agri-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.qualification || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                {editMode ? (
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-agri-500 focus:border-agri-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.specialization || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                {editMode ? (
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-agri-500 focus:border-agri-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.experience || '0'} years</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                {editMode ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-agri-500 focus:border-agri-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 whitespace-pre-line">{formData.address || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Profile Panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setPanelOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[90%] max-w-sm bg-gradient-to-b from-agri-50 via-white to-agri-100 border-r border-agri-300 ring-1 ring-agri-200 shadow-2xl p-5 overflow-y-auto animate-[slideIn_.25s_ease-out] rounded-tr-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white border border-agri-300 flex items-center justify-center text-2xl shadow">👨‍⚕️</div>
              <div>
                <p className="font-semibold text-agri-900">{displayName}</p>
                <p className="text-sm text-agri-600">Welcome, Doctor</p>
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="mt-3">
              <PanelLink 
                onClick={() => { setPanelOpen(false); navigate('/doctors/dashboard') }} 
                label="Home" 
                emoji="🏠" 
              />
              <PanelLink 
                onClick={() => { setPanelOpen(false); navigate('/doctors/profile/edit') }} 
                label="Edit Profile" 
                emoji="✏️" 
              />
              <PanelLink 
                onClick={() => { setPanelOpen(false); navigate('/doctors/appointments') }} 
                label="Appointment History" 
                emoji="📋" 
              />
            </nav>
          </div>
        </div>
      )}
      
      <style>{`@keyframes slideIn{from{transform:translateX(-100%);}to{transform:translateX(0);}}`}</style>
    </div>
  );
};

export default DoctorEditProfile;
