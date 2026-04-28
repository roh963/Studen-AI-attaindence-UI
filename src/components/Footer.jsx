const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    color: '#C9BEFF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    color: '#8494FF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    color: '#e879a0',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.com',
    color: '#8494FF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.03.05a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: 'Mail',
    href: 'mailto:hello@portal.com',
    color: '#C9BEFF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Student Portal', href: '/student-login' },
  { label: 'Faculty Portal', href: '/faculty-login' },
]

const contactLinks = [
  { label: 'hello@portal.com', href: 'mailto:hello@portal.com' },
  { label: 'support@portal.com', href: 'mailto:support@portal.com' },
]

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        background: '#2d2060',
        borderTop: '1px solid rgba(201,190,255,0.12)',
      }}
    >
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '40px 24px 32px',
        }}
      >
        {/*
          Desktop: 3-column grid
          Tablet:  2-column grid (brand full-width top, then links side by side)
          Mobile:  single column, centered
        */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* LEFT — Logo + tagline + socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8494FF, #C9BEFF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span className="font-sekuya font-black text-sm" style={{ color: '#fff' }}>P</span>
              </div>
              <span className="font-sekuya text-xl" style={{ color: '#C9BEFF' }}>Portal</span>
            </div>

            <p style={{ fontSize: '13px', color: 'rgba(255,219,253,0.5)', lineHeight: '1.7', maxWidth: '240px' }}>
              Your gateway to the academic ecosystem — students &amp; faculty, all in one place.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {socials.map(({ label, href, color, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  title={label}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(201,190,255,0.08)',
                    border: '1px solid rgba(201,190,255,0.15)',
                    color: 'rgba(201,190,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = color
                    e.currentTarget.style.borderColor = color + '55'
                    e.currentTarget.style.background = color + '15'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(201,190,255,0.5)'
                    e.currentTarget.style.borderColor = 'rgba(201,190,255,0.15)'
                    e.currentTarget.style.background = 'rgba(201,190,255,0.08)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* MIDDLE — Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p
              className="font-sekuya"
              style={{ fontSize: '12px', fontWeight: '700', color: '#C9BEFF', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Quick Links
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{ fontSize: '14px', color: 'rgba(255,219,253,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9BEFF')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,219,253,0.55)')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p
              className="font-sekuya"
              style={{ fontSize: '12px', fontWeight: '700', color: '#C9BEFF', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contactLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{ fontSize: '14px', color: 'rgba(255,219,253,0.55)', textDecoration: 'none', transition: 'color 0.2s', wordBreak: 'break-word' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C9BEFF')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,219,253,0.55)')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(201,190,255,0.1)' }}>
        <div
          style={{
            maxWidth: '1152px',
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <p style={{ fontSize: '12px', color: 'rgba(201,190,255,0.25)', textAlign: 'center' }}>
            © {new Date().getFullYear()} Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}