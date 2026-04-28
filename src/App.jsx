import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FacultyLogin from './pages/FacultyLogin'
import FacultySignup from './pages/FacultySignup'
import StudentLogin from './pages/Studentlogin'
import FacultyDashboard from './pages/FacultyDashboard'
import StudentDashboard from './pages/StudentDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/faculty-login" element={<FacultyLogin />} />
            <Route path="/faculty-signup" element={<FacultySignup />} />
            <Route path="//faculty-dashboard" element={<FacultyDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#fff',
            color: '#2d2060',
            border: '1.5px solid #C9BEFF',
            borderRadius: '14px',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: '500',
            boxShadow: '0 8px 24px rgba(132,148,255,0.15)',
          },
          success: {
            iconTheme: { primary: '#8494FF', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#e879a0', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  )
}