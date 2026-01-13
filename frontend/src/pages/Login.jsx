// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../lib/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial state from URL query parameter or location state
  const getInitialState = () => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode') || location.state?.mode;
    return mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Login'; // Default to Login
  };
  
  // State to toggle between 'Sign Up' and 'Login' view
  const [state, setState] = useState(getInitialState());
  
  // States to hold form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to the page they were trying to access, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);
  
  // Update state when URL query parameter changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode') || location.state?.mode;
    if (mode === 'login') {
      setState('Login');
    } else if (mode === 'signup') {
      setState('Sign Up');
    }
  }, [location.search, location.state]);
  
  // Handles form submission (Login or Sign Up)
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (state === 'Sign Up') {
        // Register new user
        const response = await apiClient.post('/auth/register', {
          name,
          email,
          password
        });
        
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect to the page they were trying to access, or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        // Login existing user
        const response = await apiClient.post('/auth/login', {
          email,
          password
        });
        
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Dispatch custom event to update navbar
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect to the page they were trying to access, or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Line 23: Min-height container to center the form vertically
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <form onSubmit={onSubmitHandler} 
            className='min-h-[80vh] flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] 
                       sm:min-w-96 border border-zinc-300 rounded-xl text-zinc-600 text-sm shadow-xl'>
        
        {/* Title and Subtitle */}
        <div className='w-full'>
          <p className='text-2xl font-semibold mb-1'>
            {/* Line 20: Dynamic Title */}
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </p>
          <p className='text-sm text-gray-500 mb-4'>
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-2'>
            {error}
          </div>
        )}

        {/* Full Name Field (Only shown during Sign Up) */}
        {/* Line 23: Conditional Rendering based on state */}
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input 
              className='border border-zinc-300 rounded w-full p-2 mt-1' 
              type="text" 
              placeholder='John Doe'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={state === 'Sign Up'} // Required only for sign up
            />
          </div>
        )}

        {/* Email Field */}
        <div className='w-full'>
          <p>Email</p>
          <input 
            className='border border-zinc-300 rounded w-full p-2 mt-1' 
            type="email" 
            placeholder='youremail@example.com'
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
          className='bg-blue-400 text-white w-full py-2 rounded-md mt-4 text-base transition-all duration-300 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed' 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : state}
        </button>

        {/* Toggle between Login and Sign Up */}
        {/* Line 37: Conditional rendering for the prompt */}
        {state === 'Sign Up' ? (
          <>
            <p className='mt-2'>
              Already have an account? 
              <span 
                onClick={() => setState('Login')} 
                className='text-primary ml-1 cursor-pointer font-medium'
              >
                Login here
              </span>
            </p>
            {/* Sign up as Doctor button */}
            <button
              onClick={() => navigate('/doctor/signup')}
              className='w-full mt-2 py-2 rounded-md text-base transition-all duration-300 border-2 border-blue-400 text-blue-600 hover:bg-blue-50 font-medium'
            >
              Sign up as Doctor
            </button>
          </>
        ) : (
          <p className='mt-2'>
            Create a new account? 
            <span 
              onClick={() => setState('Sign Up')} 
              className='text-primary ml-1 cursor-pointer font-medium'
            >
              Sign up here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;