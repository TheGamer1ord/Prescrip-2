import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'doctors'

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login', { replace: true });
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await apiClient.get('/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setStats(statsResponse.data.stats);

      // Fetch users
      const usersResponse = await apiClient.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setUsers(usersResponse.data.users);

      // Fetch doctors
      const doctorsResponse = await apiClient.get('/admin/doctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setDoctors(doctorsResponse.data.doctors);

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
      } else {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await apiClient.put(`/admin/users/${userId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      // Refresh users list
      const usersResponse = await apiClient.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setUsers(usersResponse.data.users);
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this user?')) {
      return;
    }

    try {
      await apiClient.put(`/admin/users/${userId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      // Refresh users list
      const usersResponse = await apiClient.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setUsers(usersResponse.data.users);
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login', { replace: true });
  };

  if (loading) {
    return (
      <div className='min-h-[80vh] flex items-center justify-center'>
        <div className='text-xl'>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-[80vh] flex items-center justify-center'>
        <div className='text-red-600'>{error}</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      {/* Header */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
            <p className='text-gray-600 mt-1'>Manage users and doctors</p>
          </div>
          <button
            onClick={handleLogout}
            className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-medium'>Total Users</h3>
            <p className='text-3xl font-bold text-blue-600 mt-2'>{stats.totalUsers}</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-medium'>Pending Approval</h3>
            <p className='text-3xl font-bold text-yellow-600 mt-2'>{stats.pendingUsers}</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-medium'>Approved Users</h3>
            <p className='text-3xl font-bold text-green-600 mt-2'>{stats.approvedUsers}</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-medium'>Total Doctors</h3>
            <p className='text-3xl font-bold text-purple-600 mt-2'>{stats.totalDoctors}</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-gray-600 text-sm font-medium'>Active Doctors</h3>
            <p className='text-3xl font-bold text-indigo-600 mt-2'>{stats.activeDoctors}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className='bg-white rounded-lg shadow-md mb-6'>
        <div className='border-b border-gray-200'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'doctors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Doctors ({doctors.length})
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className='p-6'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Password
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Created
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map((user) => (
                    <tr key={user._id} className={!user.approved ? 'bg-yellow-50' : ''}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {user.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {user.email}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {user.password || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        {!user.approved ? (
                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleApprove(user._id)}
                              className='text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded'
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(user._id)}
                              className='text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded'
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReject(user._id)}
                            className='text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded'
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className='text-center py-8 text-gray-500'>No users found</div>
              )}
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className='p-6'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Password
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Speciality
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {doctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {doctor.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {doctor.contact?.email || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        N/A
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {doctor.speciality}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            doctor.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {doctor.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(doctor.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {doctors.length === 0 && (
                <div className='text-center py-8 text-gray-500'>No doctors found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

