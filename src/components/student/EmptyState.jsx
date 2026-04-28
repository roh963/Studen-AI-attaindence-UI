// src/components/student/EmptyState.jsx

export default function EmptyState() {
  return (
    <div style={{
      gridColumn: '1 / -1',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '14px', padding: '50px 20px', textAlign: 'center',
      animation: 'slideUp 0.5s ease both',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '18px',
        background: 'rgba(201,190,255,0.2)',
        border: '1.5px solid rgba(201,190,255,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="rgba(132,148,255,0.6)" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      </div>
      <div>
        <p style={{ fontSize: '16px', fontWeight: '800', color: '#2d2060', margin: '0 0 5px' }}>
          No subjects yet
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(45,32,96,0.5)', margin: 0, maxWidth: '240px', lineHeight: 1.5 }}>
          Apne teacher ka QR code scan karo — subject mein enroll ho jaoge.
        </p>
      </div>
    </div>
  )
}