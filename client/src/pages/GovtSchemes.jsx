import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

function SchemeCard({ title, description, benefits, eligibility, howToApply, icon }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-agri-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-agri-100 rounded-full flex items-center justify-center text-2xl">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-agri-900">{title}</h3>
            <p className="text-agri-700 text-sm mt-1">{description}</p>
          </div>
          <button className="text-agri-600 hover:text-agri-800">
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-agri-100 bg-agri-50">
          {benefits && (
            <div className="mb-4">
              <h4 className="font-semibold text-agri-900 mb-2">Benefits</h4>
              <p className="text-agri-700 text-sm">{benefits}</p>
            </div>
          )}
          {eligibility && (
            <div className="mb-4">
              <h4 className="font-semibold text-agri-900 mb-2">Eligibility</h4>
              <p className="text-agri-700 text-sm">{eligibility}</p>
            </div>
          )}
          {howToApply && (
            <div className="mb-4">
              <h4 className="font-semibold text-agri-900 mb-2">How to Apply</h4>
              <p className="text-agri-700 text-sm">{howToApply}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GovtSchemes() {
  const navigate = useNavigate()
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const schemes = [
    {
      title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      description: "Central Sector Scheme providing income support to landholding farmers",
      icon: "💰",
      benefits: "Financial benefit of Rs. 6000 per annum per family, payable in three equal installments of Rs. 2000 each every four months.",
      eligibility: "All landholding eligible farmer families (subject to prevalent exclusion criteria). Not eligible for: Institutional land holders, constitutional post holders, government employees, income tax payers, professionals like doctors, engineers, lawyers, etc.",
      howToApply: "Apply through village Patwaris, revenue officials, Common Service Centres (CSCs), or self-registration through PM KISAN portal."
    },
    {
      title: "Pradhan Mantri Kisan Maan Dhan Yojana (PM-KMY)",
      description: "Social security scheme for Small and Marginal Farmers",
      icon: "👴",
      benefits: "Minimum assured pension of Rs. 3000 per month upon reaching 60 years. Family pension of Rs. 1500 per month to spouse. Government contributes equal amount to pension fund.",
      eligibility: "Small and Marginal Farmers (upto 2 hectare land), Age 18-40 years. Not eligible if covered under other statutory social security schemes.",
      howToApply: "Enroll through nearest Common Service Center (CSC) or contact Nodal Officer (PM-Kisan). Free enrollment."
    },
    {
      title: "Credit Facility for Farmers",
      description: "Loan facilities through banks and financial institutions",
      icon: "🏦",
      benefits: "Interest assistance, Kisan Credit Card, Investment loans for irrigation, mechanization, land development, etc. Collateral-free loan up to Rs. 3 lakhs at 4% interest rate.",
      eligibility: "All farmers with valid land records and bank accounts",
      howToApply: "Contact nearest Commercial Banks, Regional Rural Banks, or Cooperative Credit Institutions."
    },
    {
      title: "Crop Insurance Schemes",
      description: "Comprehensive insurance coverage for crops and farmers",
      icon: "🛡️",
      benefits: "Pradhan Mantri Fasal Bima Yojana (PMFBY), Weather Based Crop Insurance Scheme (WBCIS), Coconut Palm Insurance Scheme (CPIS), Unified Package Insurance Scheme (UPIS).",
      eligibility: "All farmers growing notified crops. Compulsory for loanee farmers, voluntary for non-loanee farmers.",
      howToApply: "Contact nearest bank branches, PACS, Cooperative Banks, or empanelled General Insurance Companies."
    },
    {
      title: "Interest Subvention for Dairy Sector",
      description: "Working capital loans for dairy cooperatives and FPOs",
      icon: "🥛",
      benefits: "Interest subvention of 2% per annum, with additional 2% incentive for prompt repayment. For dairy cooperatives and farmer producer organizations.",
      eligibility: "Dairy Cooperatives and Farmer owned milk producer companies (Milk Unions, Milk Federations, Farmer Owned/Milk Producer Companies).",
      howToApply: "Contact nearest scheduled Commercial Banks, RRBs, Cooperative Banks, or NDDB for details."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50">
      <header className="bg-white shadow-sm border-b border-agri-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="text-agri-700 hover:text-agri-900 p-2 rounded-md hover:bg-agri-100 flex items-center gap-2"
            >
              <span className="text-xl">☰</span>
              <span className="text-sm font-medium">Menu</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="AgriGrow" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-agri-900">AgriGrow</h1>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] relative">
        {/* Left Panel */}
        <div className={`fixed left-0 top-0 h-full w-64 z-30 transition-all duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 border border-agri-300 rounded-2xl shadow-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-agri-900">Navigation</h2>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="text-agri-800 hover:text-agri-900 p-2 rounded-full hover:bg-agri-300 transition-all duration-200"
              >
                ✕
              </button>
            </div>
            <nav className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 text-agri-700 hover:text-agri-900 hover:bg-agri-50 hover:translate-x-2"
              >
                <span className="text-2xl">🏠</span>
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/cattle')}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 text-agri-700 hover:text-agri-900 hover:bg-agri-50 hover:translate-x-2"
              >
                <span className="text-2xl">🐄</span>
                <span className="font-medium">Cattle</span>
              </button>
              <button
                onClick={() => navigate('/govt-schemes')}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 bg-agri-100 text-agri-900 shadow-lg transform scale-105"
              >
                <span className="text-2xl">🏛️</span>
                <span className="font-medium">Govt. Schemes</span>
                <div className="ml-auto w-2 h-2 bg-agri-900 rounded-full animate-pulse"></div>
              </button>
            </nav>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-agri-50 to-transparent rounded-b-2xl"></div>
            <div className="absolute top-1/2 left-0 w-1 h-16 bg-agri-400 rounded-r-full -translate-y-1/2"></div>
          </div>
        </div>

        {/* Overlay when panel is open on mobile */}
        {isPanelOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden" onClick={() => setIsPanelOpen(false)} />
        )}

        <main className={`flex-1 transition-all duration-300 ${isPanelOpen ? 'md:ml-0' : 'ml-0'} p-8 overflow-y-auto`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-agri-900 mb-2">Government Schemes</h2>
                <p className="text-agri-700">Comprehensive guide to farmer welfare schemes and benefits</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-agri-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-agri-700 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>

            <div className="grid gap-6">
              {schemes.map((scheme, index) => (
                <SchemeCard key={index} {...scheme} />
              ))}
            </div>

            <div className="mt-12 bg-agri-100 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-agri-900 mb-4">Important Note</h3>
              <div className="text-agri-700 space-y-2">
                <p>• All schemes are subject to eligibility criteria and government guidelines</p>
                <p>• For detailed information and latest updates, visit official government websites</p>
                <p>• Contact your local agriculture office or designated banks for assistance</p>
                <p>• Keep all necessary documents ready before applying</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
