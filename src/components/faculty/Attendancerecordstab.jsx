import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { subjectAPI } from '../../services/api'

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ present }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${present ? 'text-emerald-700' : 'text-rose-600'}`}
      style={{
        background: present ? 'rgba(52,211,153,0.15)' : 'rgba(244,63,94,0.12)',
        border: `1px solid ${present ? 'rgba(52,211,153,0.35)' : 'rgba(244,63,94,0.3)'}`,
      }}
    >
      {present ? '✓ Present' : '✗ Absent'}
    </span>
  )
}

// ── Avatar initials ────────────────────────────────────────────────────────────
function Avatar({ name }) {
  return (
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
      style={{ background: 'linear-gradient(135deg,#8494FF,#a78bff)' }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

// ── Desktop table row ──────────────────────────────────────────────────────────
function TableRow({ r }) {
  return (
    <div
      className="grid grid-cols-4 px-5 py-4 items-center transition-all hover:bg-purple-50/40"
      style={{ background: 'rgba(255,255,255,0.5)' }}
    >
      <div className="flex items-center gap-3">
        <Avatar name={r.student_name} />
        <span className="text-sm font-semibold truncate" style={{ color: '#2d2060' }}>{r.student_name}</span>
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: '#2d2060' }}>{r.subject_name}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9b8ec4' }}>{r.subject_code} · Sec {r.section}</p>
      </div>
      <span className="text-xs font-medium" style={{ color: '#7c6bbf' }}>{formatTime(r.timestamp)}</span>
      <div className="flex justify-center">
        <StatusBadge present={r.is_present} />
      </div>
    </div>
  )
}

// ── Mobile card ────────────────────────────────────────────────────────────────
function MobileCard({ r }) {
  return (
    <div className="glass rounded-2xl px-4 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={r.student_name} />
          <span className="text-sm font-bold" style={{ color: '#2d2060' }}>{r.student_name}</span>
        </div>
        <StatusBadge present={r.is_present} />
      </div>
      <div className="flex flex-col gap-0.5 pl-11">
        <p className="text-sm font-semibold" style={{ color: '#2d2060' }}>{r.subject_name}</p>
        <p className="text-xs" style={{ color: '#9b8ec4' }}>{r.subject_code} · Sec {r.section}</p>
        <p className="text-xs font-medium mt-1" style={{ color: '#7c6bbf' }}>{formatTime(r.timestamp)}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AttendanceRecordsTab() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('')

  useEffect(() => {
    subjectAPI.records()
      .then(setRecords)
      .catch(() => toast.error('Failed to load records'))
      .finally(() => setLoading(false))
  }, [])

  const subjectOptions = [...new Map(records.map(r => [r.subject_id, r])).values()]
  const filtered = filter ? records.filter(r => r.subject_id === Number(filter)) : records

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}>
          Attendance Records
        </h2>
        {subjectOptions.length > 0 && (
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-2xl text-sm font-medium outline-none input-field self-start xs:self-auto"
            style={{ minWidth: '160px' }}
          >
            <option value="">All Subjects</option>
            {subjectOptions.map(s => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.subject_code} — {s.subject_name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <p className="text-sm font-medium text-center py-10" style={{ color: '#9b8ec4' }}>Loading records…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl px-5 py-4 text-sm font-medium" style={{ background: 'rgba(201,190,255,0.2)', color: '#7c6bbf' }}>
          No attendance records found. Take attendance first!
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden md:block rounded-2xl overflow-hidden" style={{ border: '1.5px solid rgba(201,190,255,0.4)' }}>
            <div
              className="grid grid-cols-4 px-5 py-3 text-xs font-bold uppercase tracking-wider"
              style={{ background: 'rgba(132,148,255,0.08)', color: '#8494FF' }}
            >
              <span>Student</span>
              <span>Subject</span>
              <span>Time</span>
              <span className="text-center">Status</span>
            </div>
            <div className="flex flex-col divide-y" style={{ divideColor: 'rgba(201,190,255,0.25)' }}>
              {filtered.map(r => <TableRow key={r.log_id} r={r} />)}
            </div>
          </div>

          {/* ── Mobile cards (< md) ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map(r => <MobileCard key={r.log_id} r={r} />)}
          </div>
        </>
      )}
    </div>
  )
}