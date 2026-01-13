import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-blue-300 rounded-lg px-6 md:px-10 lg:px-10'>
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-3px]'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Book Appointment <br /> with Trusted Doctors
        </p>
        <div className='flex flex-row md:flex-row items-center gap-4 text-white text-sm font-light'>
          {assets.group_profiles && (
            <img className='w-28' src={assets.group_profiles} alt="Group of medical professionals" />
          )}
          <p>
            Browse through our list of verified doctors <br className='hidden sm:block' /> book an appointment that suits you best.
          </p>
        </div>
        <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'> 
          Book appointment {assets.arrow_icon && <img className='w-3' src={assets.arrow_icon} alt="Arrow icon" />}
        </a>
      </div>

      <div className='md:w-1/2 flex items-center justify-end py-10'>
        {assets.homepage_img && (
          <div className='w-full h-[400px] rounded-lg overflow-hidden'>
            <img 
              className='w-full h-full object-cover' 
              src={assets.homepage_img} 
              alt="Doctor with patient" 
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Header