import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { subjectAPI } from '../services/api'

// ── Faculty sub-components ─────────────────────────────────────────────────────

import WelcomeCard from '../components/faculty/Welcomecard'
import TabBar from '../components/faculty/Tabbar'
import TakeAttendanceTab from '../components/faculty/TakeAttendanceTab'
import ManageSubjectsTab from '../components/faculty/Managesubjectstab'
import AttendanceRecordsTab from '../components/faculty/Attendancerecordstab'

// ── JWT decode ────────────────────────────────────────────────────────────────
function decodeJWT(token) {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function FacultyDashboard() {
  const navigate = useNavigate()
  const [activeTab,    setActiveTab]   = useState('take-attendance')
  const [teacherName,  setTeacherName] = useState('Teacher')
  const [subjects,     setSubjects]    = useState([])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { navigate('/faculty-login'); return }

    const payload = decodeJWT(token)
    setTeacherName(payload?.name || payload?.username || payload?.sub || 'Teacher')

    subjectAPI.list().then(setSubjects).catch(() => {})
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/faculty-login')
  }

  return (
    <div className="bg-page min-h-screen pt-16 sm:pt-20 pb-16 px-4 sm:px-6 flex flex-col items-center">

      {/* Welcome card */}
      <WelcomeCard teacherName={teacherName} onLogout={handleLogout} />

      {/* Tab navigation */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Divider */}
      <div
        className="w-full max-w-4xl mb-6 sm:mb-8"
        style={{ height: '1px', background: 'rgba(201,190,255,0.4)' }}
      />

      {/* Active tab content */}
      <div className="w-full max-w-4xl">
        {activeTab === 'take-attendance'    && <TakeAttendanceTab subjects={subjects} />}
        {activeTab === 'manage-subjects'    && <ManageSubjectsTab />}
        {activeTab === 'attendance-records' && <AttendanceRecordsTab />}
      </div>
    </div>
  )
}























// import { useState, useEffect, useCallback } from 'react'
// import { useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'
// import { subjectAPI } from '../services/api'
// import TakeAttendanceTab from '../components/TakeAttendanceTab'

// // ── JWT decode ────────────────────────────────────────────────────────────────
// function decodeJWT(token) {
//   try {
//     return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
//   } catch { return null }
// }

// // ── Tab config ────────────────────────────────────────────────────────────────
// const tabs = [
//   {
//     id: 'take-attendance', label: 'Take Attendance',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
//   },
//   {
//     id: 'manage-subjects', label: 'Manage Subjects',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
//   },
//   {
//     id: 'attendance-records', label: 'Attendance Records',
//     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
//   },
// ]

// // ─────────────────────────────────────────────────────────────────────────────
// // TAB: Take Attendance
// // ─────────────────────────────────────────────────────────────────────────────
// // function TakeAttendanceTab({ subjects }) {
// //   return (
// //     <div>
// //       <h2 className="text-3xl font-black mb-6" style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}>
// //         Take AI Attendance
// //       </h2>
// //       {subjects.length === 0 ? (
// //         <div className="rounded-xl px-5 py-4 text-sm font-medium" style={{ background: 'rgba(201,190,255,0.2)', color: '#7c6bbf' }}>
// //           You haven't created any subjects yet! Please create one to begin!
// //         </div>
// //       ) : (
// //         <div className="rounded-xl px-5 py-4 text-sm font-medium" style={{ background: 'rgba(201,190,255,0.2)', color: '#7c6bbf' }}>
// //           Coming soon — select a subject then capture attendance via webcam.
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // ─────────────────────────────────────────────────────────────────────────────
// // TAB: Manage Subjects
// // ─────────────────────────────────────────────────────────────────────────────
// function ManageSubjectsTab() {
//   const [subjects, setSubjects]   = useState([])
//   const [loading, setLoading]     = useState(true)
//   const [showForm, setShowForm]   = useState(false)
//   const [editTarget, setEdit]     = useState(null)   // subject being edited
//   const [qrSubject, setQrSubject] = useState(null)   // subject for QR modal
//   const [form, setForm]           = useState({ subject_code: '', name: '', section: '' })
//   const [saving, setSaving]       = useState(false)

//   const load = useCallback(async () => {
//     setLoading(true)
//     try { setSubjects(await subjectAPI.list()) }
//     catch { toast.error('Failed to load subjects') }
//     finally { setLoading(false) }
//   }, [])

//   useEffect(() => { load() }, [load])

//   const resetForm = () => { setForm({ subject_code: '', name: '', section: '' }); setEdit(null); setShowForm(false) }

//   const openEdit = (s) => {
//     setForm({ subject_code: s.subject_code, name: s.name, section: s.section })
//     setEdit(s)
//     setShowForm(true)
//   }

//   const handleSave = async () => {
//     if (!form.subject_code.trim() || !form.name.trim() || !form.section.trim()) {
//       toast.error('All fields are required'); return
//     }
//     setSaving(true)
//     try {
//       if (editTarget) {
//         await subjectAPI.update(editTarget.subject_id, form)
//         toast.success('Subject updated!')
//       } else {
//         await subjectAPI.create(form)
//         toast.success('Subject created!')
//       }
//       resetForm(); load()
//     } catch (e) {
//       toast.error(e?.detail || 'Something went wrong')
//     } finally { setSaving(false) }
//   }

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this subject? All attendance records will be removed.')) return
//     try { await subjectAPI.delete(id); toast.success('Subject deleted'); load() }
//     catch (e) { toast.error(e?.detail || 'Delete failed') }
//   }

//   // ── Input style helper ────────────────────────────────────────────────────
//   const inp = 'w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all duration-200 input-field'

//   return (
//     <div>
//       {/* Header row */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-3xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}>
//           Manage Subjects
//         </h2>
//         <button
//           onClick={() => { resetForm(); setShowForm(v => !v) }}
//           className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
//           style={{ background: 'linear-gradient(135deg,#8494FF,#a78bff)', boxShadow: '0 4px 16px rgba(132,148,255,0.4)' }}
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//             <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
//           </svg>
//           {showForm && !editTarget ? 'Cancel' : 'New Subject'}
//         </button>
//       </div>

//       {/* Create / Edit form */}
//       {showForm && (
//         <div className="glass rounded-3xl p-6 mb-6 flex flex-col gap-4">
//           <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8494FF' }}>
//             {editTarget ? 'Edit Subject' : 'Create Subject'}
//           </p>
//           <div className="grid grid-cols-3 gap-4">
//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold" style={{ color: '#3d2e8e' }}>Subject Code</label>
//               <input className={inp} placeholder="CS101" value={form.subject_code}
//                 onChange={e => setForm(f => ({ ...f, subject_code: e.target.value }))} />
//             </div>
//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold" style={{ color: '#3d2e8e' }}>Subject Name</label>
//               <input className={inp} placeholder="Data Structures" value={form.name}
//                 onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
//             </div>
//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-semibold" style={{ color: '#3d2e8e' }}>Section</label>
//               <input className={inp} placeholder="A" value={form.section}
//                 onChange={e => setForm(f => ({ ...f, section: e.target.value }))} />
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={handleSave} disabled={saving}
//               className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60"
//               style={{ background: 'linear-gradient(135deg,#8494FF,#7081f5)', boxShadow: '0 4px 16px rgba(132,148,255,0.35)' }}>
//               {saving ? 'Saving...' : editTarget ? 'Update Subject' : 'Create Subject'}
//             </button>
//             <button onClick={resetForm}
//               className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
//               style={{ background: 'rgba(201,190,255,0.2)', color: '#6b5fe0', border: '1.5px solid rgba(201,190,255,0.5)' }}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Subject list */}
//       {loading ? (
//         <div className="text-sm font-medium text-center py-10" style={{ color: '#9b8ec4' }}>Loading subjects...</div>
//       ) : subjects.length === 0 ? (
//         <div className="rounded-xl px-5 py-4 text-sm font-medium" style={{ background: 'rgba(201,190,255,0.2)', color: '#7c6bbf' }}>
//           No subjects yet. Create your first subject above!
//         </div>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {subjects.map(s => (
//             <div key={s.subject_id}
//               className="glass rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
//               {/* Left info */}
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
//                   style={{ background: 'linear-gradient(135deg,#8494FF,#a78bff)' }}>
//                   {s.subject_code.slice(0, 2).toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="font-bold text-sm" style={{ color: '#2d2060' }}>{s.name}</p>
//                   <p className="text-xs font-medium mt-0.5" style={{ color: '#9b8ec4' }}>
//                     {s.subject_code} · Section {s.section}
//                   </p>
//                 </div>
//               </div>

//               {/* Action buttons */}
//               <div className="flex items-center gap-2 shrink-0">
//                 {/* QR */}
//                 <button onClick={() => setQrSubject(s)}
//                   className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
//                   style={{ background: 'rgba(132,148,255,0.12)', color: '#6b5fe0', border: '1px solid rgba(132,148,255,0.25)' }}>
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M17 20h3M20 17h-3"/></svg>
//                   QR Code
//                 </button>
//                 {/* Edit */}
//                 <button onClick={() => openEdit(s)}
//                   className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
//                   style={{ background: 'rgba(201,190,255,0.15)', color: '#7c6bbf', border: '1px solid rgba(201,190,255,0.4)' }}>
//                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
//                   Edit
//                 </button>
//                 {/* Delete */}
//                 <button onClick={() => handleDelete(s.subject_id)}
//                   className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
//                   style={{ background: 'rgba(255,126,179,0.08)', color: '#e0567a', border: '1px solid rgba(255,126,179,0.25)' }}>
//                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* QR Modal */}
//       {qrSubject && (
//         <QRModal subject={qrSubject} onClose={() => setQrSubject(null)} />
//       )}
//     </div>
//   )
// }

// // ── QR Modal ──────────────────────────────────────────────────────────────────
// function QRModal({ subject, onClose }) {
//   const joinUrl = `${window.location.origin}/student-login?join=${subject.subject_id}`
//   const qrSrc   = subjectAPI.qrUrl(subject.subject_id)

//   const copyLink = () => {
//     navigator.clipboard.writeText(joinUrl)
//     toast.success('Link copied!')
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
//       style={{ background: 'rgba(30,22,80,0.45)', backdropFilter: 'blur(8px)' }}
//       onClick={onClose}>
//       <div className="w-full max-w-sm glass-strong rounded-3xl p-8 flex flex-col items-center gap-5"
//         onClick={e => e.stopPropagation()}>
//         {/* Close */}
//         <div className="w-full flex justify-between items-start">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8494FF' }}>Join Subject</p>
//             <h3 className="text-lg font-black" style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}>
//               {subject.name}
//             </h3>
//             <p className="text-xs font-medium mt-0.5" style={{ color: '#9b8ec4' }}>
//               {subject.subject_code} · Section {subject.section}
//             </p>
//           </div>
//           <button onClick={onClose}
//             className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110"
//             style={{ background: 'rgba(201,190,255,0.2)', color: '#7c6bbf' }}>
//             ✕
//           </button>
//         </div>

//         {/* QR image from backend */}
//         <div className="rounded-2xl overflow-hidden p-3" style={{ background: '#f5f0ff', border: '2px solid rgba(132,148,255,0.2)' }}>
//           <img src={qrSrc} alt="QR Code" className="w-48 h-48 object-contain" />
//         </div>

//         <p className="text-xs text-center font-medium" style={{ color: '#9b8ec4' }}>
//           Student scan karega → Student Login page pe jaayega → Login ke baad automatically enroll ho jaayega
//         </p>

//         {/* Join link */}
//         <div className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: 'rgba(132,148,255,0.08)', border: '1.5px solid rgba(132,148,255,0.2)' }}>
//           <span className="text-xs font-medium truncate flex-1" style={{ color: '#6b5fe0' }}>{joinUrl}</span>
//           <button onClick={copyLink}
//             className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition hover:scale-105"
//             style={{ background: '#8494FF' }}>
//             Copy
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // TAB: Attendance Records
// // ─────────────────────────────────────────────────────────────────────────────
// function AttendanceRecordsTab() {
//   const [records, setRecords] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter]   = useState('')   // subject filter

//   useEffect(() => {
//     subjectAPI.records()
//       .then(setRecords)
//       .catch(() => toast.error('Failed to load records'))
//       .finally(() => setLoading(false))
//   }, [])

//   const filtered = filter
//     ? records.filter(r => r.subject_id === Number(filter))
//     : records

//   // Unique subjects for filter dropdown
//   const subjectOptions = [...new Map(records.map(r => [r.subject_id, r])).values()]

//   const formatTime = (iso) => {
//     const d = new Date(iso)
//     return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
//         <h2 className="text-3xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}>
//           Attendance Records
//         </h2>
//         {/* Subject filter */}
//         {subjectOptions.length > 0 && (
//           <select
//             value={filter}
//             onChange={e => setFilter(e.target.value)}
//             className="px-4 py-2.5 rounded-2xl text-sm font-medium outline-none input-field"
//             style={{ minWidth: '180px' }}
//           >
//             <option value="">All Subjects</option>
//             {subjectOptions.map(s => (
//               <option key={s.subject_id} value={s.subject_id}>
//                 {s.subject_code} — {s.subject_name}
//               </option>
//             ))}
//           </select>
//         )}
//       </div>

//       {loading ? (
//         <div className="text-sm font-medium text-center py-10" style={{ color: '#9b8ec4' }}>Loading records...</div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-xl px-5 py-4 text-sm font-medium" style={{ background: 'rgba(201,190,255,0.2)', color: '#7c6bbf' }}>
//           No attendance records found. Take attendance first!
//         </div>
//       ) : (
//         <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid rgba(201,190,255,0.4)' }}>
//           {/* Table header */}
//           <div className="grid grid-cols-4 px-5 py-3 text-xs font-bold uppercase tracking-wider"
//             style={{ background: 'rgba(132,148,255,0.08)', color: '#8494FF' }}>
//             <span>Student</span>
//             <span>Subject</span>
//             <span>Time</span>
//             <span className="text-center">Status</span>
//           </div>

//           {/* Rows */}
//           <div className="flex flex-col divide-y" style={{ divideColor: 'rgba(201,190,255,0.25)' }}>
//             {filtered.map(r => (
//               <div key={r.log_id}
//                 className="grid grid-cols-4 px-5 py-4 items-center transition-all hover:bg-purple-50/40"
//                 style={{ background: 'rgba(255,255,255,0.5)' }}>
//                 {/* Student */}
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
//                     style={{ background: 'linear-gradient(135deg,#8494FF,#a78bff)' }}>
//                     {r.student_name.slice(0, 2).toUpperCase()}
//                   </div>
//                   <span className="text-sm font-semibold" style={{ color: '#2d2060' }}>{r.student_name}</span>
//                 </div>

//                 {/* Subject */}
//                 <div>
//                   <p className="text-sm font-semibold" style={{ color: '#2d2060' }}>{r.subject_name}</p>
//                   <p className="text-xs mt-0.5" style={{ color: '#9b8ec4' }}>{r.subject_code} · Sec {r.section}</p>
//                 </div>

//                 {/* Time */}
//                 <span className="text-xs font-medium" style={{ color: '#7c6bbf' }}>{formatTime(r.timestamp)}</span>

//                 {/* Status badge */}
//                 <div className="flex justify-center">
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.is_present ? 'text-emerald-700' : 'text-rose-600'}`}
//                     style={{ background: r.is_present ? 'rgba(52,211,153,0.15)' : 'rgba(244,63,94,0.12)', border: `1px solid ${r.is_present ? 'rgba(52,211,153,0.35)' : 'rgba(244,63,94,0.3)'}` }}>
//                     {r.is_present ? '✓ Present' : '✗ Absent'}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN: FacultyDashboard
// // ─────────────────────────────────────────────────────────────────────────────
// export default function FacultyDashboard() {
//   const navigate = useNavigate()
//   const [activeTab, setActiveTab]   = useState('take-attendance')
//   const [teacherName, setTeacher]   = useState('Teacher')
//   const [subjects, setSubjects]     = useState([])

//   useEffect(() => {
//     const token = localStorage.getItem('access_token')
//     if (!token) { navigate('/faculty-login'); return }
//     const p = decodeJWT(token)
//     setTeacher(p?.name || p?.username || p?.sub || 'Teacher')
//     subjectAPI.list().then(setSubjects).catch(() => {})
//   }, [navigate])

//   const initials = teacherName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

//   const handleLogout = () => {
//     localStorage.removeItem('access_token')
//     navigate('/faculty-login')
//   }

//   return (
//     <div className="bg-page min-h-screen pt-20 pb-16 px-6 flex flex-col items-center">

//       {/* Welcome Card */}
//       <div className="w-full max-w-4xl flex items-center justify-between glass rounded-3xl px-10 py-6 mb-8 shadow-lg">
//         <div className="flex items-center gap-4">
//           <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0"
//             style={{ fontFamily: "'Syne',sans-serif", background: 'linear-gradient(135deg,#8494FF,#a78bff)', boxShadow: '0 4px 16px rgba(132,148,255,0.35)' }}>
//             {initials}
//           </div>
//           <div>
//             <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8494FF' }}>Welcome back</p>
//             <h2 className="text-2xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}>{teacherName}</h2>
//           </div>
//         </div>
//         <button onClick={handleLogout}
//           className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
//           style={{ background: 'rgba(255,126,179,0.1)', border: '1.5px solid rgba(255,126,179,0.3)', color: '#e0567a' }}
//           onMouseEnter={e => { e.currentTarget.style.background='rgba(255,126,179,0.18)'; e.currentTarget.style.borderColor='#e0567a' }}
//           onMouseLeave={e => { e.currentTarget.style.background='rgba(255,126,179,0.1)'; e.currentTarget.style.borderColor='rgba(255,126,179,0.3)' }}>
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
//           </svg>
//           Logout
//         </button>
//       </div>

//       {/* Tab Bar */}
//       <div className="w-full max-w-4xl flex items-center gap-3 mb-8">
//         {tabs.map(tab => {
//           const active = activeTab === tab.id
//           return (
//             <button key={tab.id} onClick={() => setActiveTab(tab.id)}
//               className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
//               style={{ background: active ? '#8494FF' : '#2d2060', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: active ? '0 4px 16px rgba(132,148,255,0.4)' : 'none' }}>
//               {tab.icon}{tab.label}
//             </button>
//           )
//         })}
//       </div>

//       <div className="w-full max-w-4xl mb-8" style={{ height: '1px', background: 'rgba(201,190,255,0.4)' }} />

//       {/* Tab Content */}
//       <div className="w-full max-w-4xl">
//         {activeTab === 'take-attendance'   && <TakeAttendanceTab subjects={subjects} />}
//         {activeTab === 'manage-subjects'   && <ManageSubjectsTab />}
//         {activeTab === 'attendance-records' && <AttendanceRecordsTab />}
//       </div>
//     </div>
//   )
// }