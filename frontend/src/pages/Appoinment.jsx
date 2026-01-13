// src/pages/Appointment.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Fixed import
import { assets } from '../assets/assets'; // Fixed import
import RelatedDoctors from '../components/RelatedDoctors'; // Import RelatedDoctors component
import apiClient from '../lib/api';

const Appointment = () => {
  const { docID } = useParams(); // Fixed parameter name to match route
  const { doctors, addAppointment } = useContext(AppContext); 
  const navigate = useNavigate();

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; 

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState(null);

  const fetchDocInfo = async () => {
    const doc = doctors.find(d => d._id === docID); // Fixed parameter name
    setDocInfo(doc);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    
    // getting current date
    let today = new Date(); 

    let tempSlots = [];

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index (21:00 or 9 PM)
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); 

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        if (currentDate.getHours() < 10) {
            currentDate.setHours(10, 0, 0, 0);
        } else if (currentDate.getMinutes() > 30) {
            currentDate.setHours(currentDate.getHours() + 1);
        }
        currentDate.setMinutes(currentDate.getMinutes() + 10);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }
      
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); 
        
        // Add slot to array with date context
        timeSlots.push({
            datetime: new Date(currentDate), // Store the actual date object
            time: formattedTime
        });
        
        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      
      // Set doc slots
      setDocSlots(prev => ([...prev, timeSlots]));
    }
  };
  
  useEffect(() => {
    fetchDocInfo();
    getAvailableSlots();
  }, [docID, doctors]); // Fixed parameter name

  // Handle booking appointment
  const handleBooking = async () => {
    if (slotTime && docInfo) {
      try {
        // Get selected date
        const selectedDate = docSlots[slotIndex][0].datetime;
        const dayName = daysOfWeek[selectedDate.getDay()];
        
        // Format date for API (YYYY-MM-DD)
        const dateStr = selectedDate.toISOString().split('T')[0];
        
        // Create appointment via API
        const response = await apiClient.post('/appointments', {
          doctorId: docInfo._id,
          date: dateStr,
          time: slotTime,
          day: dayName
        });
        
        // Create appointment object for context
        const appointment = {
          id: response.data.appointment._id,
          doctor: docInfo,
          dateTime: selectedDate,
          time: slotTime,
          status: response.data.appointment.status || 'pending'
        };
        
        // Add appointment to context
        addAppointment(appointment);
        
        // Show confirmation
        alert(`Appointment booked with ${docInfo.name} on ${dayName} at ${slotTime}`);
        // Navigate to confirmation page or MyAppointments
        navigate('/my-appointments');
      } catch (error) {
        console.error('Booking error:', error);
        alert(error.response?.data?.message || 'Failed to book appointment. Please try again.');
      }
    } else {
      alert('Please select a time slot');
    }
  };

  if (!docInfo) {
      return <div>Loading Doctor Information...</div>; 
  }

  return (
    <div className='max-w-[1200px] mx-auto p-4'>
      {/* -------------------- Doctor Details Section -------------------- */}
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Doctor Image & Basic Info */}
        <div className='md:w-1/3'>
          {docInfo.image ? (
            <img className='w-full rounded-lg bg-blue-100 object-cover aspect-square' src={docInfo.image} alt={docInfo.name} />
          ) : (
            <div className='w-full rounded-lg bg-blue-100 aspect-square flex items-center justify-center'>
              <span className='text-gray-500'>No Image Available</span>
            </div>
          )}
        </div>

        {/* Doctor Info (Right Side) */}
        <div className='md:w-2/3 flex flex-col'>
          <div className='flex-1 border border-gray-400 rounded-lg p-7 bg-white space-y-3'>
            
            {/* Name and Verified Icon */}
            <div className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              <p>{docInfo.name}</p>
              <img className='w-5' src={assets.verified_icon} alt="Verified" />
            </div>

            {/* Degree, Speciality, and Experience Button */}
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>

            {/* About Section */}
            <div>
              <div className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                <p>About</p>
                <img src={assets.info_icon} alt="Info" />
              </div>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>

            {/* Appointment Fee */}
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span className='text-gray-600'>$ {docInfo.fees}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* -------------------- Booking Slots Section -------------------- */}
      <div className='mt-8'>
        <p className='font-medium text-gray-700'>Booking slots</p>
        
        {/* Day Selector - Made smaller */}
        <div className='flex gap-2 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div 
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-3 min-w-12 rounded-full cursor-pointer text-sm
                          ${slotIndex === index ? 'bg-blue-500 text-white' : 'border border-gray-200 text-gray-600'}`}
            >
              {/* Day Name */}
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p> 
              {/* Day Date */}
              <p>{item[0] && item[0].datetime.getDate()}</p> 
            </div>
          ))}
        </div>

        {/* Time Slot Selector */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer 
                            ${item.time === slotTime ? 'bg-blue-500 text-white' : 'text-gray-400 border border-gray-300'}`}
              >
                {item.time}
              </p>
          ))}
        </div>

        {/* Book Button */}
        <div className='mt-4'>
            <button 
              onClick={handleBooking}
              className='bg-blue-500 hover:bg-blue-600 text-white text-sm font-light shrink-0 px-14 py-3 rounded-full transition-all duration-300'
            >
                Book Appointment
            </button>
        </div>
      </div>
      
      {/* Related Doctors Section */}
      <RelatedDoctors docId={docID} speciality={docInfo.speciality} />
      
    </div>
  );
};

export default Appointment;