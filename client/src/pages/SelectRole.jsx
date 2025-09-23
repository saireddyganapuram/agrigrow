import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

function Card({ title, description, icon, onClick, ghost = false }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full ${ghost ? 'bg-transparent border-2 border-agri-500' : 'border-2 border-agri-400 bg-white'} shadow-2xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-agri-300`}
    >
      {!ghost && <div className="absolute inset-0 rounded-full bg-gradient-to-br from-agri-50 to-white opacity-70" />}
      {!ghost && <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-agri-100 opacity-70 transition-transform group-hover:scale-125" />}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-5">
        <div className={`w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full ${ghost ? 'bg-white/90' : 'bg-agri-50'} border-2 border-agri-200 flex items-center justify-center text-agri-700 text-2xl md:text-3xl shadow-lg`}
        >
          {icon}
        </div>
        <h3 className="mt-3 text-lg md:text-xl lg:text-2xl font-bold text-agri-900 drop-shadow-sm text-center">{title}</h3>
        <p className="mt-1 text-agri-700 text-xs md:text-sm lg:text-base drop-shadow-sm text-center leading-tight px-2">{description}</p>
      </div>
    </button>
  )
}

export default function SelectRole() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 text-agri-900 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat opacity-10 z-0"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: 'center center',
          backgroundSize: 'clamp(20rem, 35vw, 32rem)'
        }}
        aria-hidden
      />
      <header className="border-b border-agri-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl md:text-2xl text-agri-900">
            <img src={logo} alt="AgriGrow" className="w-12 h-12" />
            AgriGrow
          </Link>
          <div className="flex-1" />
        </div>
      </header>

      <main className="relative h-screen flex flex-col">
        {/* Cards Container - Centered with background logo */}
        <div className="flex-1 flex items-center justify-center pt-8 -mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-24 lg:gap-32 w-full max-w-7xl place-items-center">
            <div className="w-full max-w-xs flex justify-center">
              <Card
                title="Farmer"
                description="Manage your crops, livestock, and access agricultural services"
                icon="🌾"
                ghost
                onClick={() => navigate('/register')}
              />
            </div>
            <div className="w-full max-w-xs flex justify-center order-first md:order-none">
              <Card
                title="Veterinary Doctor"
                description="Provide veterinary care for livestock and manage animal health records"
                icon="👨‍⚕️"
                ghost
                onClick={() => navigate('/doctors/register')}
              />
            </div>
            <div className="w-full max-w-xs flex justify-center">
              <Card
                title="Customer"
                description="Your food, straight from the farm to your door."
                icon="👤"
                ghost
                onClick={() => navigate('/customers/register')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
