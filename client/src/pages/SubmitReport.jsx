import ProfileButtonPanel from '../components/ProfileButtonPanel'
import { useState } from 'react'
import TopRightBrandBar from '../components/TopRightBrandBar'

export default function SubmitReport() {
  const [form, setForm] = useState({ title: '', description: '' })
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const onSubmit = (e) => { e.preventDefault(); alert('Report submitted (demo)') }
  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-agri-900">Submit Report</h2>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-agri-700">Title</label>
          <input value={form.title} onChange={update('title')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
        </div>
        <div>
          <label className="block text-sm text-agri-700">Description</label>
          <textarea value={form.description} onChange={update('description')} rows={6} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
        </div>
        <button className="px-6 py-2 rounded-md bg-agri-600 text-white hover:bg-agri-700">Submit</button>
        </form>
      </section>
    </>
  )
}


