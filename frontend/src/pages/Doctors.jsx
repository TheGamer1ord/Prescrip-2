// src/pages/Doctors.jsx

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Fixed import

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();

  // Assuming AppContext provides 'doctors' state
  const { doctors } = useContext(AppContext); 

  // Function to apply filter based on speciality from URL params
  const applyFilter = () => {
    if (speciality) {
      // Case-insensitive comparison for speciality filtering
      setFilterDoc(doctors.filter(doc => 
        doc.speciality.toLowerCase() === speciality.toLowerCase()
      ));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);


  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Categories Section - Left Column */}
      <div className="md:w-1/4">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <div className="flex flex-col gap-2">
          <p 
            onClick={() => navigate('/doctor/physician')} 
            className={`px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all ${speciality === "physician" ? "bg-indigo-100 text-black font-medium" : "text-gray-700"}`}
          >
            General Physician
          </p>
          
          <p 
            onClick={() => navigate('/doctor/gynecologist')} 
            className={`px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all ${speciality === "gynecologist" ? "bg-indigo-100 text-black font-medium" : "text-gray-700"}`}
          >
            Gynecologist
          </p>

          <p 
            onClick={() => navigate('/doctor/dermatologist')} 
            className={`px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all ${speciality === "dermatologist" ? "bg-indigo-100 text-black font-medium" : "text-gray-700"}`}
          >
            Dermatologist
          </p>

          <p 
            onClick={() => navigate('/doctor/pediatricians')} 
            className={`px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all ${speciality === "pediatricians" ? "bg-indigo-100 text-black font-medium" : "text-gray-700"}`}
          >
            Pediatricians
          </p>

          <p 
            onClick={() => navigate('/doctor/neurologist')} 
            className={`px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all ${speciality === "neurologist" ? "bg-indigo-100 text-black font-medium" : "text-gray-700"}`}
          >
            Neurologist
          </p>
          
          <p 
            onClick={() => navigate('/doctor/gastroenterologist')} 
            className={`px-4 py-2 border border-gray-300 rounded cursor-pointer transition-all ${speciality === "gastroenterologist" ? "bg-indigo-100 text-black font-medium" : "text-gray-700"}`}
          >
            Gastroenterologist
          </p>
        </div>
      </div>

      {/* Doctors Section - Right Column */}
      <div className="md:w-3/4">
        <p className='text-gray-600 mb-6'>Browse through the doctors specialist.</p>
        
        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterDoc.map((item, index) => (
            <div 
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden hover:translate-y-[-5px] transition-all duration-300 w-full"
            >
              <div 
                onClick={() => navigate(`/appoinment/${item._id}`)}
                className="cursor-pointer"
              >
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
                  <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                    <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                    <p>Available</p>
                  </div>
                  
                  <p className='text-gray-900 text-lg font-medium mt-2'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
              
              {/* View on Map Button */}
              {item.location && item.location.coordinates && (
                <div className='px-4 pb-4'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to map with doctor speciality filter
                      navigate(`/map?doctorSpeciality=${item.speciality}&doctorId=${item._id}`);
                    }}
                    className='w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 text-sm flex items-center justify-center gap-2'
                  >
                    <span>📍</span>
                    <span>View on Map</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;