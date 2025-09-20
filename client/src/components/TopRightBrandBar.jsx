import logo from '../assets/agri-logo.png'

export default function TopRightBrandBar() {
  return (
    <header className="border-b border-agri-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
        <div className="flex-1" />
        <div className="flex items-center gap-2 font-semibold text-lg md:text-xl text-agri-900">
          <span>AgriGrow</span>
          <img src={logo} alt="AgriGrow" className="w-8 h-8" />
        </div>
      </div>
    </header>
  )
}


