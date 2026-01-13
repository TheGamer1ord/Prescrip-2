// src/pages/Contact.jsx

import React from 'react';
// Importing assets as named import
import { assets } from '../assets/assets'; 

const Contact = () => {
  return (
    // Main container with max width and padding
    <div className='max-w-[1200px] mx-auto p-4'>
      
      {/* Title Section */}
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      {/* Image and Contact Info Section */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        
        {/* Contact Image */}
        {assets.contact_image ? (
          <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="Contact Image" />
        ) : (
          <div className='w-full md:max-w-[360px] h-64 bg-gray-200 flex items-center justify-center rounded-lg'>
            <span className='text-gray-500'>Contact Image</span>
          </div>
        )}
        
        {/* Contact Details (Right Side) */}
        <div className='flex flex-col justify-center items-start gap-6'>
          
          {/* Office Address */}
          <div>
            <p className='font-semibold text-lg text-gray-500'>Our OFFICE</p>
            <p className='text-gray-700'>
              54709 Willms Station <br /> Suite 350, Washington, USA
            </p>
          </div>

          {/* Phone and Email */}
          <div>
            <p className='font-semibold text-lg text-gray-500'>Our EMAIL & PHONE</p>
            <p className='text-gray-700'>
              Tel: (415) 555-0132 <br /> Email: greatstackdev@gmail.com
            </p>
          </div>

          {/* Careers Section */}
          <div className='mt-2'>
            <p className='text-lg text-gray-700'>Careers at PRESCRIPTO</p>
            <p className='text-gray-500'>Learn more about our teams and job openings.</p>
            
            {/* Explore Jobs Button */}
            <button className='border border-black px-8 py-4 text-sm mt-3 
                                hover:bg-black hover:text-white transition-all duration-500'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;