// src/pages/StudentDashboard.jsx

import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import toast                   from 'react-hot-toast'

import { useStudentStore }  from '../services/api'
import StudentHeader        from '../components/student/StudentHeader.jsx'
import SubjectCard          from '../components/student/SubjectCard.jsx'
import SkeletonCard         from '../components/student/SkeletonCard.jsx'
import EmptyState           from '../components/student/EmptyState.jsx'

const BASE_URL = import.meta.env.VITE_API_URL

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { student, clearStudent } = useStudentStore()

  const [subjects, setSubjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  // Guard — student nahi hai to login pe bhejo
  useEffect(() => {
    if (!student) { navigate('/student-login'); return }
    fetchSubjects()
  }, [student])

  const fetchSubjects = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${BASE_URL}/student/${student.student_id}/subjects`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.detail || 'Failed to fetch subjects')
      setSubjects(json)
    } catch (err) {
      toast.error(err.message || 'Could not load subjects')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearStudent()
    toast.success('Logged out!')
    navigate('/')
  }

  return (
    <div className="bg-page" style={{
      minHeight: '100vh',
      paddingTop: '72px',
      paddingBottom: '56px',
    }}>

      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(132,148,255,0.18) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px',  width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(180,132,255,0.12) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '0 16px' }}>

        {/* Header */}
        <StudentHeader
          student={student}
          subjectCount={subjects.length}
          loading={loading}
          onLogout={handleLogout}
        />

        {/* Section title */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '16px',
          animation: 'slideUp 0.45s ease both', animationDelay: '0.08s',
        }}>
          <div style={{ width: '4px', height: '24px', borderRadius: '4px', background: 'linear-gradient(180deg,#8494FF,#a78bff)', flexShrink: 0 }} />
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#2d2060', margin: 0 }}>
            My Enrolled Subjects
          </h2>
          {!loading && subjects.length > 0 && (
            <span style={{
              padding: '2px 9px', borderRadius: '20px',
              background: 'rgba(132,148,255,0.12)',
              border: '1px solid rgba(132,148,255,0.3)',
              fontSize: '11px', fontWeight: '700', color: '#8494FF',
            }}>
              {subjects.length}
            </span>
          )}
        </div>

        {/* Subject grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '14px',
        }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : subjects.length === 0
              ? <EmptyState />
              : subjects.map((s, i) => <SubjectCard key={s.subject_id} subject={s} index={i} />)
          }
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}














































// // src/pages/StudentDashboard.jsx
// // ============================================================
// // Student ka dashboard — enrolled subjects cards mein,
// // student info header, aur logout (Zustand store clear).
// // Backend se GET /api/student/:id/subjects fetch karta hai.
// // ============================================================

// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'
// import { useStudentStore } from '../services/api'

// const BASE_URL = import.meta.env.VITE_API_URL 

// // ── Subject color palette (cycles through) ────────────────────────────────────
// const PALETTES = [
//   { bg: 'linear-gradient(135deg, #8494FF 0%, #a78bff 100%)', light: 'rgba(132,148,255,0.12)', border: 'rgba(132,148,255,0.3)', text: '#8494FF' },
//   { bg: 'linear-gradient(135deg, #ff7eb3 0%, #e0567a 100%)', light: 'rgba(255,126,179,0.12)', border: 'rgba(255,126,179,0.3)', text: '#e0567a' },
//   { bg: 'linear-gradient(135deg, #43c6ac 0%, #3a9e88 100%)', light: 'rgba(67,198,172,0.12)', border: 'rgba(67,198,172,0.3)', text: '#3a9e88' },
//   { bg: 'linear-gradient(135deg, #f7971e 0%, #e06b1a 100%)', light: 'rgba(247,151,30,0.12)', border: 'rgba(247,151,30,0.3)', text: '#e06b1a' },
//   { bg: 'linear-gradient(135deg, #7f53ac 0%, #647dee 100%)', light: 'rgba(127,83,172,0.12)', border: 'rgba(127,83,172,0.3)', text: '#7f53ac' },
//   { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', light: 'rgba(17,153,142,0.12)', border: 'rgba(17,153,142,0.3)', text: '#11998e' },
// ]

// // ── Skeleton Card ─────────────────────────────────────────────────────────────
// const SkeletonCard = () => (
//   <div style={{
//     background: 'rgba(255,255,255,0.6)',
//     borderRadius: '24px',
//     border: '1.5px solid rgba(201,190,255,0.4)',
//     padding: '28px 24px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '14px',
//     animation: 'pulse 1.5s ease-in-out infinite',
//   }}>
//     <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(201,190,255,0.4)' }} />
//     <div style={{ width: '60%', height: '14px', borderRadius: '8px', background: 'rgba(201,190,255,0.4)' }} />
//     <div style={{ width: '40%', height: '10px', borderRadius: '8px', background: 'rgba(201,190,255,0.3)' }} />
//     <div style={{ width: '100%', height: '36px', borderRadius: '12px', background: 'rgba(201,190,255,0.25)', marginTop: '8px' }} />
//   </div>
// )

// // ── Subject Card ──────────────────────────────────────────────────────────────
// const SubjectCard = ({ subject, index }) => {
//   const palette = PALETTES[index % PALETTES.length]
//   const initials = subject.subject_code?.slice(0, 2).toUpperCase() || '??'

//   return (
//     <div
//       style={{
//         background: 'rgba(255,255,255,0.72)',
//         backdropFilter: 'blur(16px)',
//         borderRadius: '24px',
//         border: `1.5px solid ${palette.border}`,
//         padding: '28px 24px',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '14px',
//         transition: 'transform 0.22s ease, box-shadow 0.22s ease',
//         cursor: 'default',
//         boxShadow: '0 4px 24px rgba(132,148,255,0.08)',
//         animationDelay: `${index * 0.07}s`,
//         animation: 'slideUp 0.5s ease both',
//       }}
//       onMouseEnter={e => {
//         e.currentTarget.style.transform = 'translateY(-4px)'
//         e.currentTarget.style.boxShadow = `0 12px 40px ${palette.border}`
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.transform = 'translateY(0)'
//         e.currentTarget.style.boxShadow = '0 4px 24px rgba(132,148,255,0.08)'
//       }}
//     >
//       {/* Icon badge */}
//       <div style={{
//         width: '52px', height: '52px', borderRadius: '14px',
//         background: palette.bg,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         boxShadow: `0 4px 16px ${palette.border}`,
//         flexShrink: 0,
//       }}>
//         <span style={{ color: '#fff', fontSize: '16px', fontWeight: '900', letterSpacing: '0.04em' }}>
//           {initials}
//         </span>
//       </div>

//       {/* Subject info */}
//       <div style={{ flex: 1 }}>
//         <p style={{ fontSize: '17px', fontWeight: '800', color: '#1e1660', margin: '0 0 4px', lineHeight: 1.2 }}>
//           {subject.name}
//         </p>
//         <p style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(45,32,96,0.5)', margin: 0 }}>
//           {subject.subject_code}
//         </p>
//       </div>

//       {/* Section badge */}
//       <div style={{
//         display: 'inline-flex', alignItems: 'center', gap: '6px',
//         padding: '6px 12px', borderRadius: '10px',
//         background: palette.light, border: `1px solid ${palette.border}`,
//         width: 'fit-content',
//       }}>
//         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={palette.text} strokeWidth="2.5" strokeLinecap="round">
//           <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
//           <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
//         </svg>
//         <span style={{ fontSize: '11px', fontWeight: '700', color: palette.text, letterSpacing: '0.04em' }}>
//           Section {subject.section}
//         </span>
//       </div>
//     </div>
//   )
// }

// // ── Empty State ───────────────────────────────────────────────────────────────
// const EmptyState = () => (
//   <div style={{
//     gridColumn: '1 / -1',
//     display: 'flex', flexDirection: 'column', alignItems: 'center',
//     gap: '16px', padding: '60px 20px', textAlign: 'center',
//     animation: 'slideUp 0.5s ease both',
//   }}>
//     <div style={{
//       width: '72px', height: '72px', borderRadius: '20px',
//       background: 'rgba(201,190,255,0.2)', border: '1.5px solid rgba(201,190,255,0.4)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//     }}>
//       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(132,148,255,0.6)" strokeWidth="1.8" strokeLinecap="round">
//         <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
//       </svg>
//     </div>
//     <div>
//       <p style={{ fontSize: '17px', fontWeight: '800', color: '#2d2060', margin: '0 0 6px' }}>
//         No subjects yet
//       </p>
//       <p style={{ fontSize: '13px', color: 'rgba(45,32,96,0.5)', margin: 0, maxWidth: '260px' }}>
//         Scan a subject's QR code from your teacher to enroll and see it here.
//       </p>
//     </div>
//   </div>
// )

// // ── Main Dashboard ────────────────────────────────────────────────────────────
// export default function StudentDashboard() {
//   const navigate = useNavigate()
//   const { student, clearStudent } = useStudentStore()
//   const [subjects, setSubjects] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Guard — agar student nahi hai to login page pe bhejo
//   useEffect(() => {
//     if (!student) {
//       navigate('/student-login')
//       return
//     }
//     fetchSubjects()
//   }, [student])

//   const fetchSubjects = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch(`${BASE_URL}/student/${student.student_id}/subjects`)
//       const json = await res.json()
//       if (!res.ok) throw new Error(json.detail || 'Failed to fetch subjects')
//       setSubjects(json)
//     } catch (err) {
//       toast.error(err.message || 'Could not load subjects')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleLogout = () => {
//     clearStudent()
//     toast.success('Logged out successfully!')
//     navigate('/')
//   }

//   const initials = student?.name
//     ? student.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
//     : 'ST'

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f0eeff 0%, #e8e4ff 40%, #f5f0ff 100%)',
//       fontFamily: "'Outfit', sans-serif",
//       paddingTop: '80px',
//       paddingBottom: '60px',
//     }}>

//       {/* Background blobs */}
//       <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(132,148,255,0.2) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
//       <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,132,255,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

//       <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>

//         {/* ── Header Card ─────────────────────────────────────────── */}
//         <div style={{
//           background: 'rgba(255,255,255,0.72)',
//           backdropFilter: 'blur(20px)',
//           borderRadius: '28px',
//           border: '1.5px solid rgba(201,190,255,0.5)',
//           boxShadow: '0 8px 48px rgba(132,148,255,0.1)',
//           padding: '28px 32px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           gap: '16px',
//           marginBottom: '28px',
//           animation: 'slideUp 0.4s ease both',
//           flexWrap: 'wrap',
//         }}>
//           {/* Left — avatar + name */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <div style={{
//               width: '60px', height: '60px', borderRadius: '18px',
//               background: 'linear-gradient(135deg, #8494FF, #a78bff)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 4px 20px rgba(132,148,255,0.4)',
//               flexShrink: 0,
//             }}>
//               <span style={{ color: '#fff', fontSize: '22px', fontWeight: '900' }}>{initials}</span>
//             </div>
//             <div>
//               <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8494FF', margin: '0 0 3px' }}>
//                 Student Portal
//               </p>
//               <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e1660', margin: '0 0 2px', lineHeight: 1 }}>
//                 {student?.name || 'Student'}
//               </h1>
//               <p style={{ fontSize: '12px', color: 'rgba(45,32,96,0.45)', margin: 0, fontWeight: '500' }}>
//                 ID #{student?.student_id}
//               </p>
//             </div>
//           </div>

//           {/* Right — stats + logout */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             {/* Enrolled count */}
//             <div style={{
//               padding: '10px 18px', borderRadius: '16px',
//               background: 'rgba(132,148,255,0.1)',
//               border: '1.5px solid rgba(132,148,255,0.25)',
//               textAlign: 'center',
//             }}>
//               <p style={{ fontSize: '22px', fontWeight: '900', color: '#8494FF', margin: 0, lineHeight: 1 }}>
//                 {loading ? '—' : subjects.length}
//               </p>
//               <p style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(45,32,96,0.5)', margin: '2px 0 0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
//                 Enrolled
//               </p>
//             </div>

//             {/* Logout */}
//             <button
//               onClick={handleLogout}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: '8px',
//                 padding: '12px 20px', borderRadius: '16px',
//                 background: 'rgba(255,126,179,0.08)',
//                 border: '1.5px solid rgba(255,126,179,0.3)',
//                 color: '#e0567a',
//                 fontSize: '14px', fontWeight: '700',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s ease',
//               }}
//               onMouseEnter={e => {
//                 e.currentTarget.style.background = 'rgba(255,126,179,0.18)'
//                 e.currentTarget.style.borderColor = '#e0567a'
//                 e.currentTarget.style.transform = 'translateY(-1px)'
//               }}
//               onMouseLeave={e => {
//                 e.currentTarget.style.background = 'rgba(255,126,179,0.08)'
//                 e.currentTarget.style.borderColor = 'rgba(255,126,179,0.3)'
//                 e.currentTarget.style.transform = 'translateY(0)'
//               }}
//             >
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                 <polyline points="16 17 21 12 16 7" />
//                 <line x1="21" y1="12" x2="9" y2="12" />
//               </svg>
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* ── Section Title ────────────────────────────────────────── */}
//         <div style={{
//           display: 'flex', alignItems: 'center', gap: '12px',
//           marginBottom: '20px',
//           animation: 'slideUp 0.45s ease both',
//           animationDelay: '0.08s',
//         }}>
//           <div style={{
//             width: '4px', height: '28px', borderRadius: '4px',
//             background: 'linear-gradient(180deg, #8494FF, #a78bff)',
//           }} />
//           <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#2d2060', margin: 0 }}>
//             My Enrolled Subjects
//           </h2>
//           {!loading && subjects.length > 0 && (
//             <span style={{
//               padding: '3px 10px', borderRadius: '20px',
//               background: 'rgba(132,148,255,0.12)',
//               border: '1px solid rgba(132,148,255,0.3)',
//               fontSize: '12px', fontWeight: '700', color: '#8494FF',
//             }}>
//               {subjects.length}
//             </span>
//           )}
//         </div>

//         {/* ── Subject Grid ──────────────────────────────────────────── */}
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
//           gap: '18px',
//         }}>
//           {loading
//             ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
//             : subjects.length === 0
//               ? <EmptyState />
//               : subjects.map((s, i) => <SubjectCard key={s.subject_id} subject={s} index={i} />)
//           }
//         </div>
//       </div>

//       <style>{`
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(18px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.5; }
//         }
//       `}</style>
//     </div>
//   )
// }