// src/components/student/SubjectCard.jsx

const PALETTES = [
  { bg: 'linear-gradient(135deg,#8494FF,#a78bff)', light: 'rgba(132,148,255,0.12)', border: 'rgba(132,148,255,0.3)', text: '#8494FF' },
  { bg: 'linear-gradient(135deg,#ff7eb3,#e0567a)',  light: 'rgba(255,126,179,0.12)', border: 'rgba(255,126,179,0.3)', text: '#e0567a' },
  { bg: 'linear-gradient(135deg,#43c6ac,#3a9e88)',  light: 'rgba(67,198,172,0.12)',  border: 'rgba(67,198,172,0.3)',  text: '#3a9e88' },
  { bg: 'linear-gradient(135deg,#f7971e,#e06b1a)',  light: 'rgba(247,151,30,0.12)',  border: 'rgba(247,151,30,0.3)',  text: '#e06b1a' },
  { bg: 'linear-gradient(135deg,#7f53ac,#647dee)',  light: 'rgba(127,83,172,0.12)',  border: 'rgba(127,83,172,0.3)',  text: '#7f53ac' },
  { bg: 'linear-gradient(135deg,#11998e,#38ef7d)',  light: 'rgba(17,153,142,0.12)',  border: 'rgba(17,153,142,0.3)',  text: '#11998e' },
]

export default function SubjectCard({ subject, index }) {
  const p       = PALETTES[index % PALETTES.length]
  const initials = subject.subject_code?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <div
      className="card-hover"
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        border: `1.5px solid ${p.border}`,
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(132,148,255,0.07)',
        animation: 'slideUp 0.5s ease both',
        animationDelay: `${index * 0.06}s`,
      }}
    >
      {/* Icon */}
      <div style={{
        width: '46px', height: '46px', borderRadius: '13px',
        background: p.bg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 14px ${p.border}`,
      }}>
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: '900', letterSpacing: '0.04em' }}>
          {initials}
        </span>
      </div>

      {/* Info */}
      <div>
        <p style={{ fontSize: '15px', fontWeight: '800', color: '#1e1660', margin: '0 0 3px', lineHeight: 1.25 }}>
          {subject.name}
        </p>
        <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(45,32,96,0.45)', margin: 0 }}>
          {subject.subject_code}
        </p>
      </div>

      {/* Section badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '5px 10px', borderRadius: '9px', width: 'fit-content',
        background: p.light, border: `1px solid ${p.border}`,
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={p.text} strokeWidth="2.5" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span style={{ fontSize: '10px', fontWeight: '700', color: p.text, letterSpacing: '0.04em' }}>
          Section {subject.section}
        </span>
      </div>
    </div>
  )
}