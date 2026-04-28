// FacultySignup.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'

export default function FacultySignup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', name: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  // ── Username suggestions: name type hone ke baad generate ho ──
  useEffect(() => {
    if (!form.name || form.name.trim().length < 2) {
      setSuggestions([])
      return
    }
    const parts = form.name.trim().toLowerCase().split(/\s+/)
    const first = parts[0] || ''
    const last = parts[1] || ''
    const rand = Math.floor(Math.random() * 90 + 10)

    const list = [
      first && last ? `${first}.${last}`           : null,
      first && last ? `${first}_${last}`           : null,
      first && last ? `${last}.${first}`           : null,
      first         ? `${first}${rand}`            : null,
      first && last ? `${first[0]}${last}${rand}`  : null,
    ].filter(Boolean).slice(0, 4)

    setSuggestions(list)
  }, [form.name])

  const pickSuggestion = (s) => {
    setForm(f => ({ ...f, username: s }))
    setSuggestions([])
  }

  const handleRegister = async () => {
    if (!form.username || !form.name || !form.password || !form.confirm) {
      toast.error('Please fill all fields')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authAPI.signup(form)
      toast.success('Account created! Please sign in.')
      navigate('/faculty-login')
    } catch (err) {
      // Backend se jo bhi error message aaye wo dikhao
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

  const passwordsMatch = form.confirm && form.password === form.confirm
  const passwordMismatch = form.confirm && form.password !== form.confirm

  const inputStyle = (hasError) => ({
    width: '100%', padding: '13px 16px', fontSize: '15px',
    borderRadius: '14px', border: `1.5px solid ${hasError ? '#ff7eb3' : '#d4ccff'}`,
    background: 'rgba(255,255,255,0.8)', color: '#1e1660', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0eeff 0%, #e8e4ff 40%, #f5f0ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 16px 40px', fontFamily: "'Outfit', sans-serif",
    }}>

      {/* Blobs */}
      <div style={{ position: 'fixed', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,255,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(132,148,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '480px',
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)',
        borderRadius: '28px', border: '1.5px solid rgba(201,190,255,0.5)',
        padding: '48px 40px', boxShadow: '0 8px 48px rgba(132,148,255,0.12)',
        display: 'flex', flexDirection: 'column', gap: '28px',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #a78bff, #8494FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(167,139,255,0.4)', flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a78bff', marginBottom: '2px' }}>Faculty Portal</p>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e1660', margin: 0, lineHeight: 1.2 }}>Create your account</h1>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Full Name — pehle rakho taaki suggestions kaam karein */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2e8e' }}>Full Name</label>
            <input
              type="text" placeholder="Dr. Full Name"
              value={form.name} onChange={set('name')}
              style={inputStyle(false)}
              onFocus={e => e.target.style.borderColor = '#8494FF'}
              onBlur={e => e.target.style.borderColor = '#d4ccff'}
            />
          </div>

          {/* Username + Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2e8e' }}>Username</label>
            <input
              type="text" placeholder="faculty_username"
              value={form.username} onChange={set('username')}
              style={inputStyle(false)}
              onFocus={e => e.target.style.borderColor = '#8494FF'}
              onBlur={e => e.target.style.borderColor = '#d4ccff'}
            />

            {/* Suggestions chips — sirf tab dikhein jab name diya ho aur username khali ho */}
            {suggestions.length > 0 && !form.username && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{ fontSize: '11px', color: '#9b8ec4', fontWeight: '600', margin: 0, letterSpacing: '0.05em' }}>
                  SUGGESTIONS
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => pickSuggestion(s)}
                      style={{
                        padding: '5px 12px', borderRadius: '20px',
                        background: 'rgba(132,148,255,0.1)',
                        border: '1px solid rgba(132,148,255,0.3)',
                        color: '#6e7fef', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: '5px',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(132,148,255,0.2)'
                        e.currentTarget.style.borderColor = '#8494FF'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(132,148,255,0.1)'
                        e.currentTarget.style.borderColor = 'rgba(132,148,255,0.3)'
                      }}
                    >
                      {/* Lightning bolt icon */}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2L4.09 12.97H11L10 22l8.91-10.97H13L13 2z" />
                      </svg>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2e8e' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min 8 chars, uppercase, number"
                value={form.password} onChange={set('password')}
                style={{ ...inputStyle(false), paddingRight: '54px' }}
                onFocus={e => e.target.style.borderColor = '#8494FF'}
                onBlur={e => e.target.style.borderColor = '#d4ccff'}
              />
              <button onClick={() => setShowPass(p => !p)} style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#8494FF', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                <EyeIcon visible={showPass} />
              </button>
            </div>

            {/* Password strength hints */}
            {form.password && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { ok: form.password.length >= 8,          label: '8+ chars' },
                  { ok: /[A-Z]/.test(form.password),        label: 'Uppercase' },
                  { ok: /[a-z]/.test(form.password),        label: 'Lowercase' },
                  { ok: /[0-9]/.test(form.password),        label: 'Number' },
                ].map(({ ok, label }) => (
                  <span key={label} style={{
                    fontSize: '11px', fontWeight: '600',
                    color: ok ? '#4caf7d' : '#b0a0d0',
                    display: 'flex', alignItems: 'center', gap: '3px',
                  }}>
                    {ok ? '✓' : '○'} {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2e8e' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={form.confirm} onChange={set('confirm')}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                style={{ ...inputStyle(passwordMismatch), paddingRight: '54px' }}
                onFocus={e => { if (!passwordMismatch) e.target.style.borderColor = '#8494FF' }}
                onBlur={e => { if (!passwordMismatch) e.target.style.borderColor = '#d4ccff' }}
              />
              <button onClick={() => setShowConfirm(p => !p)} style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '10px',
                background: passwordMismatch ? '#ff7eb3' : passwordsMatch ? '#6bde98' : '#8494FF',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                {passwordsMatch ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : <EyeIcon visible={showConfirm} />}
              </button>
            </div>
            {passwordMismatch && (
              <p style={{ fontSize: '12px', color: '#e0567a', fontWeight: '500', margin: 0 }}>
                Passwords don't match
              </p>
            )}
          </div>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(132,148,255,0.3), transparent)' }} />

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={handleRegister} disabled={loading} style={{
            width: '100%', padding: '15px 20px', borderRadius: '14px',
            background: loading ? '#c4b8ff' : 'linear-gradient(135deg, #a78bff, #8494FF)',
            border: 'none', color: '#fff', fontSize: '15px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(167,139,255,0.4)',
          }}>
            {loading
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" /></svg>
            }
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <button onClick={() => navigate('/faculty-login')} style={{
            width: '100%', padding: '14px 20px', borderRadius: '14px',
            background: 'transparent', border: '1.5px solid #c4bcff',
            color: '#6e7fef', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            Already have an account? Sign In
          </button>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}