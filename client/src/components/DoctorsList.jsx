import { useState, useEffect } from 'react';
import { fetchDoctors, bookAppointment } from '../lib/api';

function DoctorsList({ token }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        if (!token) {
          setMessage({ text: 'Please log in to view doctors', type: 'error' });
          setLoading(false);
          return;
        }
        
        const data = await fetchDoctors(token);
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setMessage({ 
          text: error.message || 'Failed to load doctors. Please try again later.', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [token]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate || !appointmentTime || !appointmentReason) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }

    try {
      if (!token) {
        setMessage({ 
          text: 'You need to be logged in to book an appointment', 
          type: 'error' 
        });
        return;
      }

      const appointmentData = {
        date: new Date(appointmentDate).toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: appointmentTime,
        reason: appointmentReason
      };

      const response = await bookAppointment(selectedDoctor._id, appointmentData, token);
      
      if (response && response.message) {
        setMessage({ 
          text: response.message, 
          type: 'success' 
        });
        
        // Reset form
        setAppointmentDate('');
        setAppointmentTime('');
        setAppointmentReason('');
        setSelectedDoctor(null);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage({ 
        text: error.response?.data?.error || error.message || 'Failed to book appointment. Please try again.', 
        type: 'error' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-600"></div>
      </div>
    );
  }

  if (selectedDoctor) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <button 
          onClick={() => setSelectedDoctor(null)}
          className="mb-4 text-agri-600 hover:text-agri-800 flex items-center"
        >
          ← Back to doctors list
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-agri-900 mb-2">Book Appointment with Dr. {selectedDoctor.fullname}</h2>
          <p className="text-agri-700 mb-4">{selectedDoctor.specialization}</p>
          <p className="text-agri-600 mb-4">{selectedDoctor.qualification}</p>
          <p className="text-agri-600">Experience: {selectedDoctor.experience} years</p>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleBookAppointment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-agri-700 mb-1">Date</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full p-2 border border-agri-300 rounded-md focus:ring-2 focus:ring-agri-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-agri-700 mb-1">Time</label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full p-2 border border-agri-300 rounded-md focus:ring-2 focus:ring-agri-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-agri-700 mb-1">Reason for Appointment</label>
            <textarea
              value={appointmentReason}
              onChange={(e) => setAppointmentReason(e.target.value)}
              className="w-full p-2 border border-agri-300 rounded-md focus:ring-2 focus:ring-agri-500 focus:border-transparent"
              rows="3"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-agri-600 text-white py-2 px-4 rounded-md hover:bg-agri-700 transition-colors"
          >
            Book Appointment
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-agri-900 mb-6">Available Veterinarians</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-agri-100 p-3 rounded-full mr-4">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-agri-900">Dr. {doctor.fullname}</h3>
                  <p className="text-agri-600">{doctor.specialization}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-agri-700 mb-4">
                <p>👨‍🎓 {doctor.qualification}</p>
                <p>⏳ {doctor.experience} years experience</p>
                {doctor.phone && <p>📞 {doctor.phone}</p>}
                {doctor.email && <p>✉️ {doctor.email}</p>}
              </div>
              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="w-full bg-agri-100 text-agri-700 py-2 px-4 rounded-md hover:bg-agri-200 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsList;
