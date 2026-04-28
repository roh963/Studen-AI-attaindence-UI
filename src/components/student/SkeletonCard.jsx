// src/components/student/SkeletonCard.jsx

export default function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.6)',
      borderRadius: '20px',
      border: '1.5px solid rgba(201,190,255,0.4)',
      padding: '22px 20px',
      display: 'flex', flexDirection: 'column', gap: '12px',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: 'rgba(201,190,255,0.4)' }} />
      <div style={{ width: '65%', height: '13px', borderRadius: '7px', background: 'rgba(201,190,255,0.4)' }} />
      <div style={{ width: '40%', height: '10px', borderRadius: '7px', background: 'rgba(201,190,255,0.3)' }} />
      <div style={{ width: '50%', height: '28px', borderRadius: '9px', background: 'rgba(201,190,255,0.25)' }} />
    </div>
  )
}