import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/agri-logo.png'
import img1 from '../assets/image1.jpg'
import img2 from '../assets/image2.jpg'
import img3 from '../assets/image3.png'
import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'

function CircleTile({ label, emoji, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-full w-40 h-40 md:w-48 md:h-48 border border-agri-400 bg-white shadow-2xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-agri-300"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-agri-50 to-white opacity-70" />
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-agri-100 opacity-70 transition-transform group-hover:scale-125" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-agri-50 border border-agri-200 flex items-center justify-center text-agri-700 text-3xl md:text-4xl shadow-sm">
          {emoji}
        </div>
        <p className="mt-3 text-agri-900 font-semibold text-base md:text-lg">{label}</p>
      </div>
    </button>
  )
}

export default function Agri() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const slides = [img2, img1, img3]
  const [index, setIndex] = useState(0)

  const next = () => setIndex((i) => i < slides.length - 1 ? i + 1 : i)
  const prev = () => setIndex((i) => i > 0 ? i - 1 : i)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i < slides.length - 1 ? i + 1 : 0) // Reset to first image when reaching the end
    }, 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 text-agri-900">
      {/* Header with left-corner profile icon */}
      <TopRightBrandBar />

      {/* Global top-left profile button/panel */}
      <ProfileButtonPanel />

      {/* Left slide-in panel */}
      {panelOpen && null}

      {/* Banner and tiles */}
      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Image slider - full width, reduced height */}
        <div className="relative w-full h-[40vh] rounded-2xl border border-agri-300 overflow-hidden shadow-xl bg-agri-200">
          <div className="absolute inset-0 flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((src, i) => (
              <div key={i} className="min-w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
          {/* Gradient overlay for readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-agri-900/20 to-transparent" />
          {/* Controls */}
          <button onClick={prev} aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-agri-900 shadow flex items-center justify-center">‹</button>
          <button onClick={next} aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-agri-900 shadow flex items-center justify-center">›</button>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-agri-600' : 'bg-white/80 border border-agri-400'}`} aria-label={`Slide ${i+1}`} />
            ))}
          </div>
        </div>

        {/* Three circular containers */}
        <div className="mt-10 grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-3 place-items-center">
          <CircleTile label="Seeds" emoji="🌱" onClick={() => navigate('/agri/seeds')} />
          <CircleTile label="Fertilizers" emoji="🧪" onClick={() => navigate('/agri/fertilizers')} />
          <CircleTile label="Sell" emoji="🛒" onClick={() => navigate('/agri/sell')} />
        </div>
      </main>

      <style>{`@keyframes slideIn{from{transform:translateX(-100%);}to{transform:translateX(0);}}`}</style>
    </div>
  )
}


