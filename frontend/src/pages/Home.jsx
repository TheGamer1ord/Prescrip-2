import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
      
      {/* Admin and Doctor Login Options at Bottom of Home Page */}
      <div className='flex justify-center items-center gap-4 my-8 mb-10'>
        <button
          onClick={() => navigate('/admin/login')}
          className='bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg'
        >
          Login as Admin
        </button>
        <button
          onClick={() => navigate('/doctor/login')}
          className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg'
        >
          Login as Doctor
        </button>
      </div>
    </div>
  )
}

export default Home