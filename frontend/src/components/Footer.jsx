

import React from 'react';

import { assets } from '../assets/assets'; 

const Footer = () => {
  return (
 
    <div className='md:mx-10 mt-40'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        
       
        <div className='space-y-3'>
          <img className='w-40' src={assets.logo} alt="Prescripto Logo" />
          {/* Note: I've added a line break in the className for clarity, but it is one string */}
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            Lorem ipsum is simply dummy text of the printing and typesetting industry. 
          </p>
        </div>

      
        <div className='space-y-3'>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2'>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

    
        <div className='space-y-3'>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>0134678235</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

     
      <hr />
      <div className=''>
        <p className='py-5 text-sm text-center'>
          Copyright 2024© Prescripto - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;