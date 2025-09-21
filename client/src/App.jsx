import { Routes, Route, Link, useLocation } from 'react-router-dom'
import logo from './assets/agri-logo.png'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Agri from './pages/Agri'
import EditProfile from './pages/EditProfile'
import SubmitReport from './pages/SubmitReport'
import Transactions from './pages/Transactions'
import CropHistory from './pages/CropHistory'
import Cart from './pages/Cart'
import Seeds from './pages/Seeds'
import Fertilizers from './pages/Fertilizers'
import Sell from './pages/Sell'

export default function App() {
  const location = useLocation()
  const path = location.pathname
  const featurePrefixes = ['/profile/edit', '/reports/submit', '/transactions', '/crops/history', '/cart']
  const isFeaturePage = featurePrefixes.some((p) => path.startsWith(p))
  const hideFooter = path === '/login' || path === '/register' || path === '/dashboard' || path.startsWith('/agri') || isFeaturePage
  const hideHeader = path === '/dashboard' || path.startsWith('/agri') || isFeaturePage
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
              <Link to="/login" className="text-agri-700 hover:text-agri-900">Login</Link>
              <Link to="/register" className="px-3 py-1.5 rounded-md bg-agri-600 text-white hover:bg-agri-700">Get Started</Link>
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agri" element={<Agri />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/reports/submit" element={<SubmitReport />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/crops/history" element={<CropHistory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/agri/seeds" element={<Seeds />} />
          <Route path="/agri/fertilizers" element={<Fertilizers />} />
          <Route path="/agri/sell" element={<Sell />} />
        </Routes>
      </main>

      {!hideFooter && (
        <footer className="border-t border-agri-200">
          <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-agri-700 grid md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 font-semibold text-agri-900">
                <img src={logo} alt="AgriGrow" className="w-5 h-5" />
                AgriGrow
              </div>
              <p className="mt-2">Simple tools to help farmers grow and sell better.</p>
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