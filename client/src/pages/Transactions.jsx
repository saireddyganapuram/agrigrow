import { useEffect, useState } from 'react'
import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
import { getTransactions, getTransactionSummary } from '../lib/api'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTransactions = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login first')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const [transactionsRes, summaryRes] = await Promise.all([
        getTransactions(token),
        getTransactionSummary(token)
      ])
      
      setTransactions(transactionsRes.transactions || [])
      setSummary(summaryRes.summary || null)
    } catch (err) {
      setError('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const getTypeColor = (type) => {
    switch (type) {
      case 'purchase': return 'bg-blue-100 text-blue-800'
      case 'sale': return 'bg-green-100 text-green-800'
      case 'payment': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  if (loading) {
    return (
      <>
        <TopRightBrandBar />
        <ProfileButtonPanel />
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center">
            <p className="text-agri-700">Loading transactions...</p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-agri-900 text-center mb-8">Transaction History</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Transaction Summary */}
        {summary && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-agri-200 p-4 text-center">
              <h3 className="text-lg font-semibold text-agri-900">Total Transactions</h3>
              <p className="text-2xl font-bold text-agri-600">{summary.totalTransactions}</p>
            </div>
            <div className="bg-white rounded-lg border border-agri-200 p-4 text-center">
              <h3 className="text-lg font-semibold text-agri-900">Total Purchases</h3>
              <p className="text-2xl font-bold text-blue-600">₹{summary.totalPurchases.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg border border-agri-200 p-4 text-center">
              <h3 className="text-lg font-semibold text-agri-900">Total Sales</h3>
              <p className="text-2xl font-bold text-green-600">₹{summary.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg border border-agri-200 p-4 text-center">
              <h3 className="text-lg font-semibold text-agri-900">Net Amount</h3>
              <p className={`text-2xl font-bold ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{summary.netAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white rounded-lg border border-agri-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-agri-200">
            <h3 className="text-xl font-semibold text-agri-900">All Transactions</h3>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-agri-700">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-agri-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-agri-700">Transaction ID</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-agri-700">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-agri-700">Description</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-agri-700">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-agri-700">Payment Method</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-agri-700">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-agri-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-agri-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-agri-50">
                      <td className="px-6 py-4 text-sm text-agri-900 break-all">
                        {transaction.transactionId}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-agri-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-agri-900">
                        ₹{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-agri-700">
                        {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-agri-700">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}


