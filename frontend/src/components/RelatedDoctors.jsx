// src/components/RelatedDoctors.jsx

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Fixed import

// Component receives speciality and docId as props
const RelatedDoctors = ({ speciality, docId }) => { 
  
  // Accessing the global list of doctors
  const { doctors } = useContext(AppContext);
  
  // State to hold the filtered list of related doctors
  const [relDoc, setRelDocs] = useState([]);
  
  // Hook to enable navigation
  const navigate = useNavigate();

  // useEffect hook to filter doctors when dependencies change
  useEffect(() => {
    // Ensure doctors data is loaded and speciality is defined
    if (doctors.length > 0 && speciality) {
      
      // Filter doctors by matching speciality (case-insensitive) AND ensuring the ID is NOT the current doctor's ID
      const doctorsData = doctors.filter(doc => 
        doc.speciality.toLowerCase() === speciality.toLowerCase() && doc._id !== docId
      );
      
      // Update the state with the filtered data
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]); // Dependencies: Re-run when doctors list, speciality, or docId changes


  return (
    // Main container for the Related Doctors section
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      
      {/* Title */}
      <h1 className='text-3xl font-medium'>Related Doctors</h1>
      
      {/* Subtitle/Description */}
      <p className='sm:w-1/3 text-center text-sm'>Browse through our list of related doctors and book an appointment.</p>
      
      {/* Grid container for doctor cards - Made responsive like TopDoctors */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5'>
        
        {/* Mapping over the filtered doctors (slicing to show the first 10, for example) */}
        {relDoc.slice(0, 10).map((item, index) => (
          <div 
            key={index}
            // Navigate to the appointment page on click and scroll to top
            onClick={() => {navigate(`/appoinment/${item._id}`); window.scrollTo(0, 0)}}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300 w-full'
          >
            {/* Doctor Image Container */}
            <div className='bg-blue-50 p-3'>
              {item.image ? (
                <img src={item.image} alt={item.name} className='w-full aspect-square object-cover rounded-lg' />
              ) : (
                <div className='w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center'>
                  <span className='text-gray-500'>No Image</span>
                </div>
              )}
            </div>
            
            <div className='p-4'>
              {/* Availability status */}
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                <p>Available</p>
              </div>
              
              {/* Doctor Name */}
              <p className='text-gray-900 text-lg font-medium mt-2'>{item.name}</p>
              
              {/* Doctor Speciality */}
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exporting the component
export default RelatedDoctors;