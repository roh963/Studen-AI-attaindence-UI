import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      if (window.innerWidth > 640) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: '#8494FF' }}
    >
      {/* Main bar */}
      <div
        className="flex items-center justify-between h-16"
        style={{ paddingLeft: '28px', paddingRight: '24px' }}
      >
        {/* LEFT — Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.22)' }}
          >
            <span className="font-sekuya font-black text-base" style={{ color: '#fff' }}>
              P
            </span>
          </div>
          <span className="font-sekuya text-xl tracking-wide" style={{ color: '#fff' }}>
            Portal
          </span>
        </div>

        {/* RIGHT — Desktop */}
        {width > 640 ? (
          <div className="flex items-center gap-3 shrink-0">
            {!isHome && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  color: '#fff',
                  height: '34px',
                  minWidth: '110px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Go Back Home
              </button>
            )}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                height: '34px',
                minWidth: '120px',
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: '#FFDBFD' }} />
              Academic Portal
            </div>
          </div>
        ) : (
          /* Hamburger — mobile */
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.32)',
              borderRadius: '10px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {menuOpen ? (
              /* X icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {width <= 640 && menuOpen && (
        <div
          style={{
            background: '#7382ee',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
      

          {/* Go Back Home — only when not on home */}
          {!isHome && (
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '600',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Go Back Home
            </button>
          )}

          {/* Student Portal */}
          <a
            href="/student-login"
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              fontWeight: '500',
              padding: '10px 14px',
              textDecoration: 'none',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.07)',
            }}
          >
            Student Portal
          </a>

          {/* Faculty Portal */}
          <a
            href="/faculty-login"
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              fontWeight: '500',
              padding: '10px 14px',
              textDecoration: 'none',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.07)',
            }}
          >
            Faculty Portal
          </a>
        </div>
      )}
    </nav>
  )
}