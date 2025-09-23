import { useState, useEffect } from 'react';
import { format, parseISO, isBefore, parse } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export default function DoctorAppointments({ appointments = [], onStatusChange }) {
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, you would make an API call here to update the appointment status
      // For now, we'll just update the local state
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setLocalAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus } 
            : apt
        )
      );
      
      if (onStatusChange) {
        onStatusChange(appointmentId, newStatus);
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = (appointmentId) => {
    // In a real app, you would open a modal or navigate to a reschedule page
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      alert(`Reschedule appointment with ${appointment.patientName} (${appointment.time} on ${format(parseISO(appointment.date), 'MMM d, yyyy')})`);
    } else {
      alert(`Reschedule appointment ${appointmentId}`);
    }
  };

  if (localAppointments.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
        <p className="mt-1 text-sm text-gray-500">You don't have any appointments yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localAppointments.map((appointment) => {
              const appointmentDate = parseISO(appointment.date);
              const isPast = isBefore(appointmentDate, new Date());
              
              return (
                <tr key={appointment.id} className={`${isPast ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-50`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-agri-100 flex items-center justify-center">
                        <span className="text-agri-800">
                          {appointment.patientName?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName || 'Unknown Patient'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patientPhone || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {format(parseISO(appointment.date), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      <p className="font-medium">{appointment.reason || 'No reason provided'}</p>
                      {appointment.notes && (
                        <p className="text-gray-600 text-xs mt-1">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[appointment.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {appointment.status === 'pending' && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          disabled={isLoading}
                          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50 mr-2"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReschedule(appointment.id)}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {appointment.status === 'confirmed' && !isPast && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleReschedule(appointment.id)}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          disabled={isLoading}
                          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          Mark as Done
                        </button>
                      </div>
                    )}
                    {isPast && appointment.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                        disabled={isLoading}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        Mark as Done
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
