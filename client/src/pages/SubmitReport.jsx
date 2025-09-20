import ProfileButtonPanel from '../components/ProfileButtonPanel'
import { useState } from 'react'
import TopRightBrandBar from '../components/TopRightBrandBar'

export default function SubmitReport() {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' or 'book'
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    file: null,
    contactName: '',
    contactPhone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const update = (k) => (e) => {
    if (k === 'file') {
      setForm((f) => ({ ...f, [k]: e.target.files[0] }))
    } else {
      setForm((f) => ({ ...f, [k]: e.target.value }))
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    // Simulate API call
    setTimeout(() => {
      if (activeTab === 'upload') {
        setSuccess('Soil test report uploaded successfully!')
      } else {
        setSuccess('Agent booking request submitted successfully! We will contact you soon.')
      }
      setSubmitting(false)
      // Reset form
      setForm({ 
        title: '', 
        description: '', 
        file: null,
        contactName: '',
        contactPhone: '',
        address: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      })
    }, 2000)
  }
  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-agri-900 text-center">Submit Report</h2>
        
        {/* Tab Navigation */}
        <div className="mt-8 flex justify-center">
          <div className="flex rounded-lg border border-agri-300 bg-white p-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'upload'
                  ? 'bg-agri-600 text-white'
                  : 'text-agri-700 hover:bg-agri-50'
              }`}
            >
              Upload Report
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'book'
                  ? 'bg-agri-600 text-white'
                  : 'text-agri-700 hover:bg-agri-50'
              }`}
            >
              Book Agent
            </button>
          </div>
        </div>

        {/* Upload Report Tab */}
        {activeTab === 'upload' && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-agri-50 to-white rounded-2xl border border-agri-200 p-6">
              <h3 className="text-xl font-semibold text-agri-900 mb-4">Upload Soil Test Report</h3>
              <p className="text-agri-700 mb-6">Upload your existing soil test report for analysis and recommendations.</p>
              
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-agri-700 mb-2">Report Title</label>
                  <input 
                    value={form.title} 
                    onChange={update('title')} 
                    placeholder="e.g., Soil Test Report - Field A"
                    className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-agri-700 mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-agri-300 rounded-lg p-6 text-center hover:border-agri-400 transition-colors">
                    <input
                      type="file"
                      onChange={update('file')}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-4xl text-agri-400 mb-2">📄</div>
                      <p className="text-agri-700">
                        {form.file ? form.file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-agri-500 mt-1">
                        PDF, JPG, PNG, DOC (Max 10MB)
                      </p>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-agri-700 mb-2">Additional Notes</label>
                  <textarea 
                    value={form.description} 
                    onChange={update('description')} 
                    rows={4} 
                    placeholder="Any additional information about your soil or farming practices..."
                    className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                  />
                </div>
                
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                
                <button 
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-6 py-3 rounded-md ${submitting ? 'bg-agri-300 text-agri-600' : 'bg-agri-600 text-white hover:bg-agri-700'}`}
                >
                  {submitting ? 'Uploading...' : 'Upload Report'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Book Agent Tab */}
        {activeTab === 'book' && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-agri-50 to-white rounded-2xl border border-agri-200 p-6">
              <h3 className="text-xl font-semibold text-agri-900 mb-4">Book Our Agent for Soil Testing</h3>
              <p className="text-agri-700 mb-6">Schedule a visit from our certified soil testing agent to collect samples and provide detailed analysis.</p>
              
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-agri-700 mb-2">Contact Name</label>
                    <input 
                      value={form.contactName} 
                      onChange={update('contactName')} 
                      placeholder="Your full name"
                      className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-agri-700 mb-2">Phone Number</label>
                    <input 
                      type="tel"
                      value={form.contactPhone} 
                      onChange={update('contactPhone')} 
                      placeholder="+91 98765 43210"
                      className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-agri-700 mb-2">Farm Address</label>
                  <textarea 
                    value={form.address} 
                    onChange={update('address')} 
                    rows={3}
                    placeholder="Complete address of your farm including landmarks..."
                    className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-agri-700 mb-2">Preferred Date</label>
                    <input 
                      type="date"
                      value={form.preferredDate} 
                      onChange={update('preferredDate')} 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-agri-700 mb-2">Preferred Time</label>
                    <select 
                      value={form.preferredTime} 
                      onChange={update('preferredTime')} 
                      className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                      required
                    >
                      <option value="">Select time</option>
                      <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                      <option value="evening">Evening (4:00 PM - 6:00 PM)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-agri-700 mb-2">Additional Notes</label>
                  <textarea 
                    value={form.notes} 
                    onChange={update('notes')} 
                    rows={3}
                    placeholder="Any specific requirements or information about your soil..."
                    className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                  />
                </div>
                
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                
                <button 
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-6 py-3 rounded-md ${submitting ? 'bg-agri-300 text-agri-600' : 'bg-agri-600 text-white hover:bg-agri-700'}`}
                >
                  {submitting ? 'Booking...' : 'Book Agent Visit'}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  )
}


