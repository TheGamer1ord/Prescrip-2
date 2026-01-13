import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/api';

const DoctorSignup = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await apiClient.post('/doctor-auth/register', {
        name,
        email,
        profession,
        password
      });
      
      // Show success message
      alert('Doctor account created successfully! Please wait for admin approval before logging in.');
      
      // Redirect to doctor login
      navigate('/doctor/login', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create doctor account';
      setError(errorMessage);
      console.error('Doctor signup error:', err);
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
            Sign up as Doctor
          </p>
          <p className='text-sm text-gray-500 mb-4'>
            Create your doctor account (requires admin approval)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-2'>
            {error}
          </div>
        )}

        {/* Full Name Field */}
        <div className='w-full'>
          <p>Full Name</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1' 
            type="text" 
            placeholder='Dr. John Doe'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        {/* Profession Field */}
        <div className='w-full'>
          <p>Profession</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1' 
            type="text" 
            placeholder='e.g., Neurologist, Cardiologist'
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
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
            minLength={6}
          />
        </div>
        
        {/* Submit Button */}
        <button 
          className='bg-blue-600 text-white w-full py-2 rounded-md mt-4 text-base transition-all duration-300 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed' 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Sign up as Doctor'}
        </button>

        {/* Login link */}
        <p className='mt-2 text-sm'>
          Already have an account? 
          <span 
            onClick={() => navigate('/doctor/login')} 
            className='text-blue-600 ml-1 cursor-pointer font-medium hover:underline'
          >
            Login here
          </span>
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

export default DoctorSignup;

