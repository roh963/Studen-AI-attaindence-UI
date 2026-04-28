import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api.js'

export default function FacultyLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const data = await authAPI.login(username, password)

      // Token localStorage mein save karo
      localStorage.setItem('access_token', data.access_token)

      toast.success('Logged in successfully!')
      navigate('/faculty-dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0eeff 0%, #e8e4ff 40%, #f5f0ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 16px 40px',
      fontFamily: "'Outfit', sans-serif",
    }}>

      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', top: '-80px', right: '-80px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(132,148,255,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-60px', left: '-60px',
        width: '260px', height: '260px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,132,255,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '28px',
        border: '1.5px solid rgba(201,190,255,0.5)',
        padding: '48px 40px',
        boxShadow: '0 8px 48px rgba(132,148,255,0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>

        {/* Icon badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #8494FF, #a78bff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(132,148,255,0.35)',
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8494FF', marginBottom: '2px' }}>
              Faculty Portal
            </p>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e1660', margin: 0, lineHeight: 1.2 }}>
              Welcome back
            </h1>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2e8e', letterSpacing: '0.01em' }}>
              Username
            </label>
            <input
              type="text"
              placeholder="faculty_username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 16px',
                fontSize: '15px',
                borderRadius: '14px',
                border: '1.5px solid #d4ccff',
                background: 'rgba(255,255,255,0.8)',
                color: '#1e1660',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#8494FF'}
              onBlur={e => e.target.style.borderColor = '#d4ccff'}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2e8e', letterSpacing: '0.01em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%',
                  padding: '13px 54px 13px 16px',
                  fontSize: '15px',
                  borderRadius: '14px',
                  border: '1.5px solid #d4ccff',
                  background: 'rgba(255,255,255,0.8)',
                  color: '#1e1660',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#8494FF'}
                onBlur={e => e.target.style.borderColor = '#d4ccff'}
              />
              <button
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: '8px', top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: '#8494FF', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#6e7fef'}
                onMouseLeave={e => e.currentTarget.style.background = '#8494FF'}
              >
                <EyeIcon visible={showPass} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(132,148,255,0.3), transparent)' }} />

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px 20px',
              borderRadius: '14px',
              background: loading ? '#b0baff' : 'linear-gradient(135deg, #8494FF, #7081f5)',
              border: 'none',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(132,148,255,0.4)',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button
            onClick={() => navigate('/faculty-signup')}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '14px',
              background: 'transparent',
              border: '1.5px solid #c4bcff',
              color: '#6e7fef',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(132,148,255,0.08)'
              e.currentTarget.style.borderColor = '#8494FF'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#c4bcff'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Don't have an account? Register
          </button>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}