import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className='max-w-[1200px] mx-auto p-4'>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        {assets.about_image ? (
          <img className='w-full md:max-w-[360px] rounded-lg' src={assets.about_image} alt="About Prescripto" />
        ) : (
          <div className='w-full md:max-w-[360px] rounded-lg bg-gray-200 h-64 flex items-center justify-center'>
            <span className='text-gray-500'>About Image</span>
          </div>
        )}
        
        <div className='flex-1'>
          <p className='text-gray-700'>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently.</p>
          
          <p className='mt-4 text-gray-700'>
            <b className='text-gray-800'>Our Mission:</b> Prescripto is committed to excellence in healthcare technology. We continuously strive to make doctor appointments seamless and accessible.
          </p>
          
          <p className='mt-4 text-gray-700'>
            <b className='text-gray-800'>Our Vision:</b> Our vision at Prescripto is to create a seamless healthcare experience for every individual.
          </p>
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
        <div className='border px-6 py-8 flex flex-col gap-3 text-[15px] 
                        hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        
        <div className='border px-6 py-8 flex flex-col gap-3 text-[15px] 
                        hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        
        <div className='border px-6 py-8 flex flex-col gap-3 text-[15px] 
                        hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  );
};

export default About;