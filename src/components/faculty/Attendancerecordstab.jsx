// src/components/faculty/AttendanceRecordsTab.jsx
// ================================================================
// Subject-wise categorized attendance records.
// Each subject = collapsible accordion card showing ALL students
// (present + absent) with stats bar on top.
// ================================================================

import { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { subjectAPI } from '../../services/api.js'

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

// ── Color palette cycling per subject ────────────────────────────────────────
const SUBJECT_COLORS = [
  { accent: '#8494FF', light: 'rgba(132,148,255,0.1)',  border: 'rgba(132,148,255,0.25)', glow: 'rgba(132,148,255,0.15)' },
  { accent: '#e0567a', light: 'rgba(224,86,122,0.08)',  border: 'rgba(224,86,122,0.22)',  glow: 'rgba(224,86,122,0.12)' },
  { accent: '#3a9e88', light: 'rgba(58,158,136,0.09)',  border: 'rgba(58,158,136,0.25)',  glow: 'rgba(58,158,136,0.12)' },
  { accent: '#e06b1a', light: 'rgba(224,107,26,0.09)',  border: 'rgba(224,107,26,0.22)',  glow: 'rgba(224,107,26,0.12)' },
  { accent: '#7f53ac', light: 'rgba(127,83,172,0.09)',  border: 'rgba(127,83,172,0.22)',  glow: 'rgba(127,83,172,0.12)' },
  { accent: '#c09800', light: 'rgba(192,152,0,0.09)',   border: 'rgba(192,152,0,0.22)',   glow: 'rgba(192,152,0,0.12)'  },
]

// ── Mini stat pill ────────────────────────────────────────────────────────────
function StatPill({ count, label, color, bg, border }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '20px',
      background: bg, border: `1px solid ${border}`,
    }}>
      <span style={{ fontSize: '14px', fontWeight: '800', color, lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: '10px', fontWeight: '600', color, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
    </div>
  )
}

// ── Attendance progress bar ───────────────────────────────────────────────────
function AttendanceBar({ present, total, accent }) {
  const pct = total === 0 ? 0 : Math.round((present / total) * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '99px', background: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          width: `${pct}%`,
          background: accent,
          transition: 'width 0.6s cubic-bezier(.34,1.56,.64,1)',
          boxShadow: `0 0 8px ${accent}60`,
        }} />
      </div>
      <span style={{ fontSize: '11px', fontWeight: '700', color: accent, minWidth: '34px', textAlign: 'right' }}>{pct}%</span>
    </div>
  )
}

// ── Single student row inside accordion ──────────────────────────────────────
function StudentRow({ log, accent, idx }) {
  const initials = log.student_name?.slice(0, 2).toUpperCase() || '??'
  const isPresent = log.is_present

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      alignItems: 'center',
      gap: '12px',
      padding: '11px 18px',
      background: idx % 2 === 0 ? 'rgba(255,255,255,0.55)' : 'rgba(248,246,255,0.6)',
      borderTop: '1px solid rgba(201,190,255,0.15)',
      transition: 'background 0.15s',
      animation: `fadeRow 0.3s ease both`,
      animationDelay: `${idx * 0.04}s`,
    }}>

      {/* Student name + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
          background: isPresent
            ? `linear-gradient(135deg, ${accent}, ${accent}99)`
            : 'linear-gradient(135deg, #c4b8d8, #a89fc4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '10px', fontWeight: '800',
        }}>
          {initials}
        </div>
        <span style={{
          fontSize: '13px', fontWeight: '600', color: '#2d2060',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {log.student_name}
        </span>
      </div>

      {/* Timestamp */}
      <span style={{ fontSize: '11px', color: '#9b8ec4', fontWeight: '500', whiteSpace: 'nowrap' }}>
        {formatTime(log.timestamp)}
      </span>

      {/* Status badge */}
      <span style={{
        padding: '3px 10px', borderRadius: '20px',
        fontSize: '11px', fontWeight: '700',
        color: isPresent ? '#2e7d58' : '#b03060',
        background: isPresent ? 'rgba(52,211,153,0.14)' : 'rgba(244,63,94,0.1)',
        border: `1px solid ${isPresent ? 'rgba(52,211,153,0.35)' : 'rgba(244,63,94,0.28)'}`,
        whiteSpace: 'nowrap',
      }}>
        {isPresent ? '✓ Present' : '✗ Absent'}
      </span>
    </div>
  )
}

// ── Subject accordion card ────────────────────────────────────────────────────
function SubjectAccordion({ subjectData, colorScheme, defaultOpen, index }) {
  const [open, setOpen] = useState(defaultOpen)
  const { subject_code, subject_name, section, logs } = subjectData
  const { accent, light, border } = colorScheme

  const presentCount = logs.filter(l => l.is_present).length
  const absentCount  = logs.length - presentCount

  // Latest session timestamp
  const latestTime = logs.length > 0
    ? formatTime(logs.reduce((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? a : b).timestamp)
    : null

  return (
    <div style={{
      borderRadius: '20px',
      border: `1.5px solid ${open ? accent : border}`,
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      overflow: 'hidden',
      transition: 'border-color 0.25s, box-shadow 0.25s',
      boxShadow: open ? `0 8px 32px ${colorScheme.glow}` : '0 2px 12px rgba(132,148,255,0.06)',
      animation: `slideUp 0.4s ease both`,
      animationDelay: `${index * 0.07}s`,
    }}>

      {/* ── Header (clickable) ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: '14px', padding: '18px 20px',
          background: open ? light : 'transparent',
          border: 'none', cursor: 'pointer',
          transition: 'background 0.2s',
          textAlign: 'left',
          outline: 'none',
        }}
      >
        {/* Subject code badge */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '13px', flexShrink: 0,
          background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '13px', fontWeight: '900', letterSpacing: '0.02em',
          boxShadow: `0 4px 14px ${accent}40`,
        }}>
          {subject_code.slice(0, 2).toUpperCase()}
        </div>

        {/* Subject info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#1e1660', lineHeight: 1.2 }}>
              {subject_name}
            </span>
            <span style={{
              fontSize: '10px', fontWeight: '700', color: accent,
              background: light, border: `1px solid ${border}`,
              padding: '2px 7px', borderRadius: '20px', letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {subject_code}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#9b8ec4', fontWeight: '500' }}>Section {section}</span>
            {latestTime && <span style={{ fontSize: '11px', color: '#b8aedd', fontWeight: '400' }}>· Last: {latestTime}</span>}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '8px', maxWidth: '240px' }}>
            <AttendanceBar present={presentCount} total={logs.length} accent={accent} />
          </div>
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
          <StatPill count={presentCount} label="Present" color="#2e7d58" bg="rgba(52,211,153,0.12)" border="rgba(52,211,153,0.3)" />
          <StatPill count={absentCount}  label="Absent"  color="#b03060" bg="rgba(244,63,94,0.09)"  border="rgba(244,63,94,0.25)" />
        </div>

        {/* Chevron */}
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke={accent} strokeWidth="2.5" strokeLinecap="round"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Body (collapsible) ── */}
      {open && (
        <div>
          {/* Column headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto',
            gap: '12px', padding: '8px 18px',
            background: `${light}`,
            fontSize: '10px', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '0.08em', color: accent,
            borderTop: `1px solid ${border}`,
          }}>
            <span>Student</span>
            <span>Time</span>
            <span>Status</span>
          </div>

          {/* Rows */}
          {logs
            .slice()
            .sort((a, b) => {
              // Present first, then by name
              if (b.is_present !== a.is_present) return b.is_present - a.is_present
              return a.student_name.localeCompare(b.student_name)
            })
            .map((log, idx) => (
              <StudentRow key={log.log_id} log={log} accent={accent} idx={idx} />
            ))
          }

          {/* Footer summary */}
          <div style={{
            padding: '12px 18px',
            background: light,
            borderTop: `1px solid ${border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#9b8ec4' }}>
              {logs.length} student{logs.length !== 1 ? 's' : ''} total
            </span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: accent }}>
              {logs.length === 0 ? '—' : `${Math.round((presentCount / logs.length) * 100)}% attendance`}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function AttendanceRecordsTab() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    subjectAPI.records()
      .then(setRecords)
      .catch(() => toast.error('Failed to load records'))
      .finally(() => setLoading(false))
  }, [])

  // Group records by subject_id
  const grouped = useMemo(() => {
    const map = {}
    records.forEach(r => {
      const key = r.subject_id
      if (!map[key]) {
        map[key] = {
          subject_id:   r.subject_id,
          subject_code: r.subject_code,
          subject_name: r.subject_name,
          section:      r.section,
          logs: [],
        }
      }
      map[key].logs.push(r)
    })
    return Object.values(map).sort((a, b) => a.subject_code.localeCompare(b.subject_code))
  }, [records])

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return grouped
    const q = search.toLowerCase()
    return grouped.filter(g =>
      g.subject_name.toLowerCase().includes(q) ||
      g.subject_code.toLowerCase().includes(q) ||
      g.section.toLowerCase().includes(q)
    )
  }, [grouped, search])

  // Overall stats
  const totalPresent = records.filter(r => r.is_present).length
  const totalAbsent  = records.length - totalPresent

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#2d2060', margin: 0, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.02em' }}>
            Attendance Records
          </h2>

          {/* Overall stats row */}
          {!loading && records.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <StatPill count={grouped.length} label="Subjects" color="#8494FF" bg="rgba(132,148,255,0.1)" border="rgba(132,148,255,0.25)" />
              <StatPill count={totalPresent}   label="Present"  color="#2e7d58" bg="rgba(52,211,153,0.12)" border="rgba(52,211,153,0.3)" />
              <StatPill count={totalAbsent}    label="Absent"   color="#b03060" bg="rgba(244,63,94,0.09)"  border="rgba(244,63,94,0.25)" />
            </div>
          )}
        </div>

        {/* Search bar */}
        {!loading && grouped.length > 1 && (
          <div style={{ position: 'relative', maxWidth: '320px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b8ec4" strokeWidth="2.2" strokeLinecap="round"
              style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 36px',
                borderRadius: '14px', border: '1.5px solid rgba(201,190,255,0.5)',
                background: 'rgba(255,255,255,0.8)', color: '#2d2060',
                fontSize: '13px', fontWeight: '500', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#8494FF'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,190,255,0.5)'}
            />
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {loading ? (
        /* Skeleton */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '88px', borderRadius: '20px',
              background: 'rgba(201,190,255,0.15)',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>

      ) : filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '14px', padding: '60px 20px', textAlign: 'center',
          animation: 'slideUp 0.4s ease both',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'rgba(201,190,255,0.2)', border: '1.5px solid rgba(201,190,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(132,148,255,0.5)" strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: '800', color: '#2d2060', margin: '0 0 5px' }}>
              {search ? 'No subjects match your search' : 'No attendance records yet'}
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(45,32,96,0.5)', margin: 0 }}>
              {search ? 'Try a different keyword' : 'Take attendance first to see records here.'}
            </p>
          </div>
        </div>

      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((subjectData, idx) => (
            <SubjectAccordion
              key={subjectData.subject_id}
              subjectData={subjectData}
              colorScheme={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]}
              defaultOpen={idx === 0}
              index={idx}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeRow  { from { opacity:0; transform:translateX(-6px);} to { opacity:1; transform:translateX(0); } }
        @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
      `}</style>
    </div>
  )
}




