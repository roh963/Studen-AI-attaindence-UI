// WelcomeCard — shows teacher name + logout button

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export default function WelcomeCard({ teacherName, onLogout }) {
  const initials = teacherName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-full max-w-4xl flex items-center justify-between glass rounded-3xl px-6 sm:px-10 py-5 sm:py-6 mb-6 sm:mb-8 shadow-lg gap-4">
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div
          className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-xl shrink-0"
          style={{
            fontFamily: "'Syne',sans-serif",
            background: 'linear-gradient(135deg,#8494FF,#a78bff)',
            boxShadow: '0 4px 16px rgba(132,148,255,0.35)',
          }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#8494FF' }}>
            Welcome back
          </p>
          <h2
            className="text-xl sm:text-2xl font-black truncate"
            style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}
          >
            {teacherName}
          </h2>
        </div>
      </div>

      {/* Right: Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shrink-0"
        style={{
          background: 'rgba(255,126,179,0.1)',
          border: '1.5px solid rgba(255,126,179,0.3)',
          color: '#e0567a',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,126,179,0.18)'
          e.currentTarget.style.borderColor = '#e0567a'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,126,179,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,126,179,0.3)'
        }}
      >
        <LogoutIcon />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  )
}