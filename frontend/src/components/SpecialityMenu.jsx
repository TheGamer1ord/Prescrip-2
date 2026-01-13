import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800 ' id='speciality' >
      <h1 className='text-3xl font-medium' >
        Find By Speciality
      </h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Browse through various medical specialities to find the right doctor for your needs . Whether you're looking for a general practitioner or a specialist, our comprehensive list has got you covered.
      </p>

      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {specialityData && specialityData.map((item, index) => (
          <Link onClick={() => window.scrollTo(0, 0)} className='flex flex-col items-center text-xs cursor-pointer shrink-0 hover:translate-y-2.5 transition-all duration-500' key={index} to={`/doctor/${item.speciality}`}>
            {item.image && (
              <img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
            )}
            <p>
              {item.speciality.charAt(0).toUpperCase() + item.speciality.slice(1)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu