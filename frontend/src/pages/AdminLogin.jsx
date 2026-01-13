import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await apiClient.post('/admin/login', {
        email,
        password
      });
      
      // Store admin token separately
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      
      // Dispatch event to update navbar
      window.dispatchEvent(new Event('authChange'));
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid admin credentials';
      setError(errorMessage);
      console.error('Admin login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <form onSubmit={onSubmitHandler} 
            className='min-h-[80vh] flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] 
                       sm:min-w-96 border border-zinc-300 rounded-xl text-zinc-600 text-sm shadow-xl'>
        
        {/* Title and Subtitle */}
        <div className='w-full'>
          <p className='text-2xl font-semibold mb-1'>
            Admin Login
          </p>
          <p className='text-sm text-gray-500 mb-4'>
            Enter admin credentials to access dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-2'>
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className='w-full'>
          <p>Email</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1' 
            type="email" 
            placeholder='admin@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className='w-full'>
          <p>Password</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1' 
            type="password" 
            placeholder=''
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {/* Submit Button */}
        <button 
          className='bg-blue-600 text-white w-full py-2 rounded-md mt-4 text-base transition-all duration-300 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed' 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Login as Admin'}
        </button>

        {/* Info */}
        <p className='mt-2 text-xs text-gray-500'>
          Default credentials: email: admin@gmail.com, password: admin
        </p>

        {/* Back to home */}
        <p className='mt-2 text-sm'>
          <span 
            onClick={() => navigate('/')} 
            className='text-blue-600 ml-1 cursor-pointer font-medium hover:underline'
          >
            Back to Home
          </span>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;

