import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/api';

const DoctorLogin = () => {
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
      const response = await apiClient.post('/doctor-auth/login', {
        email,
        password
      });
      
      // Store doctor token separately
      localStorage.setItem('doctorToken', response.data.token);
      localStorage.setItem('doctorUser', JSON.stringify(response.data.doctor));
      
      // Dispatch event to update navbar
      window.dispatchEvent(new Event('authChange'));
      
      // Redirect to doctor dashboard
      navigate('/doctor/dashboard', { replace: true });
    } catch (err) {
      console.error('Doctor login error:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.status === 404 || err.message?.includes('Network Error') || err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please ensure the backend server is running on port 2222.');
      } else if (err.response?.status === 401) {
        setError(err.response?.data?.message || 'Invalid email or password');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to login. Please try again.');
      }
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
            Doctor Login
          </p>
          <p className='text-sm text-gray-500 mb-4'>
            Enter your credentials to access doctor dashboard
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
            placeholder='doctor@example.com'
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
          {loading ? 'Please wait...' : 'Login as Doctor'}
        </button>

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

export default DoctorLogin;

