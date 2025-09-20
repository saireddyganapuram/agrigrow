import { Link } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

export default function Landing() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center min-h-[calc(100vh-64px-200px)] md:min-h-[calc(100vh-72px-200px)]">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-agri-900">
          Empowering Farmers with Simple Tools
        </h1>
        <p className="mt-4 text-agri-700 max-w-prose">
          Access market prices, connect with buyers, and manage your farm data securely.
        </p>
        <div className="mt-8">
          <Link to="/register" className="inline-block px-6 py-3 rounded-md bg-agri-600 text-white hover:bg-agri-700">
            Get Started
          </Link>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div
          className="w-64 h-64 sm:w-80 sm:h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-[f5fbf6] bg-contain bg-center"
          style={{ backgroundImage: `url(${logo})` }}
          aria-label="AgriGrow logo"
          role="img"
        />
      </div>
    </section>
  )
}


