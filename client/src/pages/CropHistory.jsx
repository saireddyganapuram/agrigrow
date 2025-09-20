import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
export default function CropHistory() {
  const sold = [
    { crop: 'Rice', qty: '800 kg', price: '₹28/kg', date: '2024-12-20' },
  ]
  const bought = [
    { item: 'Seeds - Maize', qty: '10 kg', price: '₹2,000', date: '2024-10-15' },
  ]
  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-agri-900">Crops Sold</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {sold.map((s, i) => (
            <div key={i} className="rounded-lg border border-agri-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-agri-900">{s.crop}</p>
              <p className="text-agri-700">{s.qty} • {s.price}</p>
              <p className="text-agri-700">{s.date}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-agri-900">Items Bought</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {bought.map((b, i) => (
            <div key={i} className="rounded-lg border border-agri-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-agri-900">{b.item}</p>
              <p className="text-agri-700">{b.qty} • {b.price}</p>
              <p className="text-agri-700">{b.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}


