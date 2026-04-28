// src/components/student/StudentHeader.jsx

export default function StudentHeader({ student, subjectCount, loading, onLogout }) {
  const initials = student?.name
    ? student.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'ST'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)',
      borderRadius: '22px',
      border: '1.5px solid rgba(201,190,255,0.5)',
      boxShadow: '0 6px 36px rgba(132,148,255,0.09)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px',
      marginBottom: '22px',
      animation: 'slideUp 0.4s ease both',
      flexWrap: 'wrap',
    }}>

      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '15px', flexShrink: 0,
          background: 'linear-gradient(135deg,#8494FF,#a78bff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(132,148,255,0.35)',
        }}>
          <span style={{ color: '#fff', fontSize: '19px', fontWeight: '900' }}>{initials}</span>
        </div>
        <div>
          <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8494FF', margin: '0 0 2px' }}>
            Student Portal
          </p>
          <h1 style={{ fontSize: '19px', fontWeight: '800', color: '#1e1660', margin: '0 0 1px', lineHeight: 1.1 }}>
            {student?.name || 'Student'}
          </h1>
        </div>
      </div>

      {/* Count + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          padding: '8px 16px', borderRadius: '14px',
          background: 'rgba(132,148,255,0.1)',
          border: '1.5px solid rgba(132,148,255,0.25)',
          textAlign: 'center', minWidth: '60px',
        }}>
          <p style={{ fontSize: '20px', fontWeight: '900', color: '#8494FF', margin: 0, lineHeight: 1 }}>
            {loading ? '—' : subjectCount}
          </p>
          <p style={{ fontSize: '9px', fontWeight: '600', color: 'rgba(45,32,96,0.5)', margin: '2px 0 0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Enrolled
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 16px', borderRadius: '14px',
            background: 'rgba(255,126,179,0.08)',
            border: '1.5px solid rgba(255,126,179,0.3)',
            color: '#e0567a', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,126,179,0.18)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,126,179,0.08)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  )
}