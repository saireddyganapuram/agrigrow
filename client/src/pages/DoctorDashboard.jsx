import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { request } from '../lib/api';
import logo from '../assets/agri-logo.png';
import DoctorAppointments from '../components/DoctorAppointments';

function PanelLink({ onClick, label, emoji }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-md hover:bg-agri-100 active:bg-agri-200 transition flex items-center gap-2 border-b border-agri-100 last:border-b-0"
    >
      <span className="text-lg" aria-hidden>{emoji}</span>
      <span className="font-medium text-agri-900">{label}</span>
    </button>
  )
}

function Card({ title, description, icon, onClick, ghost = false }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full w-64 h-64 md:w-72 md:h-72 ${ghost ? 'bg-transparent border border-agri-500' : 'border border-agri-400 bg-white'} shadow-2xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-agri-300`}
    >
      {!ghost && <div className="absolute inset-0 rounded-full bg-gradient-to-br from-agri-50 to-white opacity-70" />}
      {!ghost && <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-agri-100 opacity-70 transition-transform group-hover:scale-125" />}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${ghost ? 'bg-white/80' : 'bg-agri-50'} border border-agri-200 flex items-center justify-center text-agri-700 text-3xl md:text-4xl shadow-sm`}
        >
          {icon}
        </div>
        <h3 className="mt-4 text-xl md:text-2xl font-bold text-agri-900 drop-shadow-sm">{title}</h3>
        <p className="mt-2 text-agri-700 text-sm md:text-base drop-shadow-sm">{description}</p>
      </div>
    </button>
  )
}

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const [me, setMe] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const doctor = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = me?.fullname || user?.fullname || doctor?.fullname || 'Doctor';

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const goToEditProfile = () => {
    navigate('/profile/edit')
    setPanelOpen(false)
  }

  const goToHistory = () => {
    // For now, navigate to a placeholder history page
    // This could be updated when doctor history functionality is implemented
    alert('Doctor history functionality coming soon!')
    setPanelOpen(false)
  }

  const goToHome = () => {
    navigate('/')
    setPanelOpen(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // First get the doctor's profile
        const doctorResponse = await request('/api/doctors/me', { 
          method: 'GET',
          token 
        });

        if (doctorResponse?.error) {
          if (doctorResponse.error === 'Access denied. Doctor account required.') {
            // Redirect to login if not a doctor
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(doctorResponse.error);
        }

        if (doctorResponse?.doctor) {
          setMe(doctorResponse.doctor);
          localStorage.setItem('doctor', JSON.stringify(doctorResponse.doctor));
        }

        // Then get the doctor's appointments
        const appointmentsResponse = await request('/api/doctors/appointments', { 
          method: 'GET',
          token 
        });

        if (appointmentsResponse?.error) {
          throw new Error(appointmentsResponse.error);
        }

        if (appointmentsResponse?.appointments) {
          // Transform appointment data to match expected format
          const transformedAppointments = appointmentsResponse.appointments.map(apt => ({
            id: apt._id || apt.id,
            patientName: apt.user?.fullname || 'Unknown Patient',
            patientPhone: apt.user?.phone || 'N/A',
            date: apt.date,
            time: apt.time,
            reason: apt.reason,
            notes: apt.notes,
            status: apt.status || 'pending',
            createdAt: apt.createdAt
          }));
          
          setAppointments(transformedAppointments);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.status === 401 || error.message.includes('Access denied')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Apply status filter to appointments
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(apt => apt.status === statusFilter));
    }
  }, [appointments, statusFilter]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setIsLoading(true);
      const response = await request(
        `/api/doctors/appointments/${appointmentId}/status`,
        {
          method: 'PATCH',
          body: { status: newStatus },
          token: localStorage.getItem('token')
        }
      );
      
      if (response?.error) {
        throw new Error(response.error);
      }
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus } 
            : apt
        )
      );
      
      // Show success message
      alert(`Appointment ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert(`Failed to update appointment: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-agri-900">Appointments</h1>
          <p className="mt-2 text-agri-700">Manage your appointments, {displayName}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-agri-500 focus:ring-agri-500 text-sm"
                  >
                    <option value="all">All Appointments</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="w-full sm:w-auto">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agri-500"></div>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <DoctorAppointments 
                  appointments={filteredAppointments} 
                  onStatusChange={handleStatusChange} 
                />
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-700">No appointments found</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  {statusFilter === 'all' 
                    ? "You don't have any appointments scheduled yet. New appointments will appear here." 
                    : `No ${statusFilter} appointments found. Try changing the filter or check back later.`}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500"
                  >
                    View All Appointments
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Profile Panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setPanelOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[90%] max-w-sm bg-gradient-to-b from-agri-50 via-white to-agri-100 border-r border-agri-300 ring-1 ring-agri-200 shadow-2xl p-5 overflow-y-auto animate-[slideIn_.25s_ease-out] rounded-tr-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border border-agri-300 flex items-center justify-center text-2xl shadow">👨‍⚕️</div>
              <div>
                <p className="font-semibold text-agri-900">{displayName}</p>
                <p className="text-sm text-agri-700">Welcome back, Doctor</p>
              </div>
            </div>
            
            <div className="mt-5 border-t border-agri-200" />
            
            {/* Profile Info */}
            <div className="mt-4 space-y-2 text-sm">
              {me?.email && <div><span className="font-medium">Email:</span> {me.email}</div>}
              {me?.phone && <div><span className="font-medium">Phone:</span> {me.phone}</div>}
              {me?.qualification && <div><span className="font-medium">Qualification:</span> {me.qualification}</div>}
              {me?.specialization && <div><span className="font-medium">Specialization:</span> {me.specialization}</div>}
              {me?.experience && <div><span className="font-medium">Experience:</span> {me.experience} years</div>}
              {me?.licenseNumber && <div><span className="font-medium">License:</span> {me.licenseNumber}</div>}
            </div>
            
            <div className="mt-5 border-t border-agri-200" />
            
            {/* Navigation Links */}
            <nav className="mt-3 space-y-1">
              <PanelLink 
                onClick={() => { setPanelOpen(false); navigate('/doctors/dashboard') }} 
                label="Dashboard" 
                emoji="📋" 
              />
              <PanelLink 
                onClick={() => { setPanelOpen(false); navigate('/doctors/profile/edit') }} 
                label="Edit Profile" 
                emoji="✏️" 
              />
              <PanelLink 
                onClick={() => { setPanelOpen(false); navigate('/doctors/appointments') }} 
                label="Appointment History" 
                emoji="📅" 
              />
            </nav>
          </div>
        </div>
      )}
      
      <style>{`@keyframes slideIn{from{transform:translateX(-100%);}to{transform:translateX(0);}}`}</style>
    </div>
  )
}
