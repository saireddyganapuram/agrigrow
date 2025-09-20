import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
export default function Transactions() {
  const data = [
    { id: 'TXN-1001', type: 'Sell', item: 'Wheat', qty: '500 kg', amount: '₹75,000', date: '2025-01-02' },
    { id: 'TXN-1002', type: 'Buy', item: 'Fertilizer Urea', qty: '20 bags', amount: '₹12,000', date: '2025-01-10' },
  ]
  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-agri-900">Transactions</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-agri-200 bg-white rounded-md overflow-hidden">
          <thead className="bg-agri-100">
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Item</th>
              <th className="text-left px-4 py-2">Quantity</th>
              <th className="text-left px-4 py-2">Amount</th>
              <th className="text-left px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t border-agri-200">
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.type}</td>
                <td className="px-4 py-2">{row.item}</td>
                <td className="px-4 py-2">{row.qty}</td>
                <td className="px-4 py-2">{row.amount}</td>
                <td className="px-4 py-2">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    </>
  )
}


