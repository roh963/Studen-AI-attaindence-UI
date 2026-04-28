import { useNavigate } from 'react-router-dom'

export default function Card({ name, description, buttonName, redirectTo, icon, accentColor = '#8494FF' }) {
  const navigate = useNavigate()

  return (
    <div
      className="card-hover rounded-3xl cursor-pointer group"
      style={{
        background: '#fff',
        border: '1.5px solid #C9BEFF',
        width: '100%',
        maxWidth: '310px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '18px',
        boxSizing: 'border-box',
      }}
      onClick={() => navigate(redirectTo)}
    >
      {/* Icon */}
      <div
        className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{
          width: '68px',
          height: '68px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          background: 'rgba(201,190,255,0.2)',
          border: '1.5px solid #C9BEFF',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', minWidth: 0 }}>
        <h2
          className="font-sekuya text-xl font-black tracking-wide"
          style={{ color: '#2d2060' }}
        >
          {name}
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'rgba(45,32,96,0.55)' }}
        >
          {description}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #C9BEFF, transparent)',
          flexShrink: 0,
        }}
      />

      {/* Button */}
      <button
        style={{
          width: '100%',
          padding: '11px 20px',
          borderRadius: '14px',
          border: `1.5px solid ${accentColor}`,
          background: `${accentColor}15`,
          color: accentColor,
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.22s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = accentColor
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.boxShadow = `0 6px 20px ${accentColor}35`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = `${accentColor}15`
          e.currentTarget.style.color = accentColor
          e.currentTarget.style.boxShadow = 'none'
        }}
        onClick={(e) => { e.stopPropagation(); navigate(redirectTo) }}
      >
        {buttonName}
      </button>
    </div>
  )
}