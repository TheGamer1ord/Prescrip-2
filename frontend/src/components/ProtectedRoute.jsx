import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import apiClient from '../lib/api';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [isApproved, setIsApproved] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApproval = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Get user data from localStorage first
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          // Check if user is admin (admins are always approved)
          if (user.role === 'admin') {
            setIsApproved(true);
            setLoading(false);
            return;
          }
          // Check approval status from localStorage
          if (user.approved === true) {
            setIsApproved(true);
            setLoading(false);
            return;
          }
        }

        // If not in localStorage or not approved, verify with API
        const response = await apiClient.get('/auth/me');
        const user = response.data.user;
        
        // Admins are always approved
        if (user.role === 'admin') {
          setIsApproved(true);
        } else {
          // Regular users need approval
          setIsApproved(user.approved === true);
        }
        
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error checking user approval:', error);
        setIsApproved(false);
      } finally {
        setLoading(false);
      }
    };

    checkApproval();
  }, [token]);

  // Show loading state while checking
  if (loading) {
    return (
      <div className='min-h-[80vh] flex items-center justify-center'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is not approved, show message and redirect
  if (isApproved === false) {
    return (
      <div className='min-h-[80vh] flex items-center justify-center p-4'>
        <div className='text-center max-w-md'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Account Pending Approval</h2>
          <p className='text-gray-600 mb-6'>
            Your account is pending admin approval. Please wait for admin to approve your account before accessing these features.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition'
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // User is approved, show protected content
  return children;
};

export default ProtectedRoute;

