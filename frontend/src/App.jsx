import React from 'react'
import { Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import MyProfile from './pages/MyProfile'
import Appoinment from './pages/Appoinment'
import MyAppointments from './pages/MyAppointments'
import Contact from './pages/Contact'
import Map from './pages/Map'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import DoctorLogin from './pages/DoctorLogin'
import DoctorSignup from './pages/DoctorSignup'
import DoctorDashboard from './pages/DoctorDashboard'

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check the console for details.</h1>;
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <Routes>
      {/* Admin routes - separate layout (no Navbar/Footer) */}
      <Route path='/admin/login' element={
        <ErrorBoundary>
          <AdminLogin/>
        </ErrorBoundary>
      } />
      <Route path='/admin/dashboard' element={
        <ErrorBoundary>
          <AdminDashboard/>
        </ErrorBoundary>
      } />
      
      {/* Doctor routes - separate layout (no Navbar/Footer) */}
      <Route path='/doctor/login' element={
        <ErrorBoundary>
          <DoctorLogin/>
        </ErrorBoundary>
      } />
      <Route path='/doctor/signup' element={
        <ErrorBoundary>
          <DoctorSignup/>
        </ErrorBoundary>
      } />
      <Route path='/doctor/dashboard' element={
        <ErrorBoundary>
          <DoctorDashboard/>
        </ErrorBoundary>
      } />
      
      {/* Main app routes - with Navbar and Footer */}
      <Route path='*' element={
        <div className='mx-4 sm:mx-[10%]'>
          <ErrorBoundary>
            <Navbar/>
          </ErrorBoundary>
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path='/' element={
              <ErrorBoundary>
                <Home/>
              </ErrorBoundary>
            } />
            <Route path='/login' element={
              <ErrorBoundary>
                <Login/>
              </ErrorBoundary>
            } />
            
            {/* Protected routes - require authentication */}
            <Route path='/doctor' element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Doctors/>
                </ProtectedRoute>
              </ErrorBoundary>
            } />  
            <Route path='/doctor/:speciality' element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Doctors/>
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path='/contact' element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Contact/>
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path='/about' element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <About/>
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path='/map' element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Map/>
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path='/my-profile' element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <MyProfile/>
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path='/my-appointments' element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <MyAppointments/>
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path='/appoinment/:docID' element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Appoinment/>
                </ProtectedRoute>
              </ErrorBoundary>
            } />
          </Routes>
          <ErrorBoundary>
            <Footer/>
          </ErrorBoundary>
        </div>
      } />
    </Routes>
  )
}

export default App
