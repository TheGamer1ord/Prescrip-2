import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/api';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if doctor is logged in
    const doctorToken = localStorage.getItem('doctorToken');
    if (!doctorToken) {
      navigate('/doctor/login', { replace: true });
      return;
    }

    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('doctorToken');
      
      const response = await apiClient.get('/appointments/doctor', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAppointments(response.data.appointments || []);
      setError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.response?.data?.message || 'Failed to fetch appointments');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('doctorToken');
        localStorage.removeItem('doctorUser');
        navigate('/doctor/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorUser');
    navigate('/doctor/login', { replace: true });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const doctorUser = JSON.parse(localStorage.getItem('doctorUser') || '{}');

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>Doctor Dashboard</h1>
              <p className='text-gray-600 mt-1'>Welcome, {doctorUser.name || 'Doctor'}</p>
            </div>
            <button
              onClick={handleLogout}
              className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors'
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        {/* Appointments Section */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Appointments</h2>
          
          {loading ? (
            <div className='text-center py-8'>
              <p className='text-gray-600'>Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-600'>No appointments found.</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Patient
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Day
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Time
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {appointment.user?.name || 'N/A'}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {appointment.user?.email || ''}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatDate(appointment.date)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {appointment.day}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {appointment.time}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

