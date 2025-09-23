import { Routes, Route, Link, useLocation } from 'react-router-dom'
import logo from './assets/agri-logo.png'

// Page Components
import Register from './pages/Register'
import SelectRole from './pages/SelectRole'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorRegister from './pages/DoctorRegister'
import CustomerRegister from './pages/CustomerRegister'
import Dashboard from './pages/Dashboard'
import Agri from './pages/Agri'
import EditProfile from './pages/EditProfile'
import SubmitReport from './pages/SubmitReport'
import Transactions from './pages/Transactions'
import Landing from './pages/Landing'
import Login from './pages/Login'
import CustomerLogin from './pages/CustomerLogin'
import DoctorLogin from './pages/DoctorLogin'
import CropHistory from './pages/CropHistory'
import Cattle from './pages/Cattle'
import Sell from './pages/Sell'
import Seeds from './pages/Seeds'
import Fertilizers from './pages/Fertilizers'
import Cart from './pages/Cart'
import CattleHistory from './pages/CattleHistory'
import GovtSchemes from './pages/GovtSchemes'
import CustomerDashboard from './pages/CustomerDashboard'
import DoctorEditProfile from './pages/DoctorEditProfile'

export default function App() {
  const location = useLocation()
  const path = location.pathname
  const featurePrefixes = ['/profile/edit', '/reports/submit', '/transactions', '/crops/history', '/cart']
  const isFeaturePage = featurePrefixes.some((p) => path.startsWith(p))
  const hideFooter = path === '/login' || path === '/customer-login' || path === '/doctor-login' || path === '/register' || path === '/dashboard' || path === '/customers/dashboard' || path === '/doctors/dashboard' || path.startsWith('/agri') || path === '/cattle' || path === '/cattle-history' || path === '/govt-schemes' || path === '/select-role' || path.startsWith('/doctors') || path.startsWith('/customers') || isFeaturePage
  const hideHeader = path === '/dashboard' || path === '/customers/dashboard' || path === '/doctors/dashboard' || path.startsWith('/agri') || path === '/cattle' || path === '/cattle-history' || path === '/govt-schemes' || path === '/select-role' || path.startsWith('/doctors') || path.startsWith('/customers') || path === '/register' || path === '/login' || path === '/customer-login' || path === '/doctor-login' || isFeaturePage
  return (
    <div className="min-h-screen bg-agri-50 text-agri-900 flex flex-col">
      {!hideHeader && (
        <header className="border-b border-agri-200 bg-white/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 font-semibold text-2xl text-agri-900">
              <img src={logo} alt="AgriGrow" className="w-10 h-10" />
              AgriGrow
            </Link>
            <nav className="flex items-center gap-4 text-base">
              {path !== '/login' && (
                path === '/' ? (
                  <Link to="/select-role" className="px-3 py-1.5 rounded-md bg-agri-600 text-white hover:bg-agri-700">Get Started</Link>
                ) : (
                  <Link to="/login" className="px-3 py-1.5 rounded-md bg-agri-600 text-white hover:bg-agri-700">Login</Link>
                )
              )}
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/doctors/register" element={<DoctorRegister />} />
          <Route path="/doctors/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctors/profile/edit" element={<DoctorEditProfile />} />
          <Route path="/customers/register" element={<CustomerRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers/dashboard" element={<CustomerDashboard />} />
          <Route path="/agri" element={<Agri />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/reports/submit" element={<SubmitReport />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/crops/history" element={<CropHistory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/agri/seeds" element={<Seeds />} />
          <Route path="/agri/fertilizers" element={<Fertilizers />} />
          <Route path="/agri/sell" element={<Sell />} />
          <Route path='/cattle' element={<Cattle />} />
          <Route path='/cattle-history' element={<CattleHistory />} />
          <Route path='/govt-schemes' element={<GovtSchemes />} />
        </Routes>
      </main>

      {!hideFooter && (
        <footer className="border-t border-agri-200">
          <div className="max-w-6xl mx-auto px-4 py-1 text-sm text-agri-700 grid md:grid-cols-3 gap-20">
            <div>
              <div className="flex items-center gap-2 font-semibold text-agri-900">
                <img src={logo} alt="AgriGrow" className="w-5 h-5" />
                AgriGrow
              </div>
              <p className="mt-2">An Integrated Platform for Crop Production, Animal Husbandry, and Market Place 
                                  below the agri grow in the landing page</p>
            </div>
            <div>
              <p className="font-semibold text-agri-900">Contact</p>
              <p className="mt-2">support@agrigrow.in</p>
              <p>+91 90000 00000</p>
            </div>
            <div>
              <p className="font-semibold text-agri-900">Location</p>
              <p className="mt-2">Village Road, Farm District</p>
              <p>India</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}