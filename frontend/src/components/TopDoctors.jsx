import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors: contextDoctors } = useContext(AppContext)
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>
            Top Doctors to Book
        </h1>
        <p className='sm:w-1/3 text-center text-sm'>
            Simply browse through the list of top-rated doctors and book an appointment with clicks.
        </p>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-5'>
         {contextDoctors && contextDoctors.slice(0,10).map((item,index)=>(
         <div onClick={()=>{navigate(`/appoinment/${item._id}`); window.scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300 w-full' key={index}> 
            <div className='bg-blue-50 p-1'>
              {item.image ? (
                <img src={item.image} alt={item.name} className='w-full aspect-square object-cover rounded-md' />
              ) : (
                <div className='w-full aspect-square bg-gray-200 rounded-md flex items-center justify-center'>
                  <span className='text-gray-500 text-xs'>No Image</span>
                </div>
              )}
            </div>
            <div className='p-1.5'>
                <div className='flex items-center gap-1.5 text-xs text-center text-green-500'>
                    <p className='w-1.5 h-1.5 bg-green-500 rounded-full'></p>
                    <p>Available</p>
                </div>
                <p className='text-gray-900 font-medium mt-1 text-xs'>
                {item.name}
                </p>
                <p className='text-gray-600 text-xs'>
                    {item.speciality}
                </p>
            </div>
         </div>
         ))}   
        </div>
        <button onClick={()=>{navigate('/doctor'); window.scrollTo(0,0)}} className='bg-blue-50 text-gray-900 px-8 py-1.5 rounded-full mt-6 hover:scale-105 transition-all duration-300 text-xs'>
            more
        </button>
    </div>
  )
}

export default TopDoctors