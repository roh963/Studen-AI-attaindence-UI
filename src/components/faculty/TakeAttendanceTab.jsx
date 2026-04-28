// TakeAttendanceTab.jsx
// ============================================================
// Drop-in replacement for the TakeAttendanceTab component
// inside FacultyDashboard.jsx
// ============================================================

import { useRef, useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL 

function authHeaders() {
  const token = localStorage.getItem('access_token')
  return { Authorization: `Bearer ${token}` }
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload  = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

const Spin = ({ size = 16, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.5"
    style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
)

const Thumb = ({ src, onRemove, idx }) => (
  <div style={{ position: 'relative', width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid rgba(132,148,255,0.3)', flexShrink: 0 }}>
    <img src={src} alt={`photo-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    <button onClick={() => onRemove(idx)}
      style={{ position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(224,86,122,0.9)', border: 'none', color: '#fff', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
      ×
    </button>
  </div>
)

// ── Photo Modal ───────────────────────────────────────────────────────────────
function PhotoModal({ onClose, onAdd }) {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const streamRef  = useRef(null)
  const fileRef    = useRef(null)

  const [mode, setMode]            = useState('camera')
  const [cameraReady, setCamReady] = useState(false)
  const [cameraError, setCamErr]   = useState(null)
  const [photos, setPhotos]        = useState([])

  useEffect(() => {
    if (mode === 'camera') startCam()
    else stopCam()
    return () => stopCam()
  }, [mode])

  const startCam = async () => {
    setCamErr(null); setCamReady(false)
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
      streamRef.current = s
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.onloadedmetadata = () => setCamReady(true)
      }
    } catch { setCamErr('Camera access denied') }
  }

  const stopCam = () => streamRef.current?.getTracks().forEach(t => t.stop())

  const takePhoto = () => {
    const v = videoRef.current; const c = canvasRef.current
    if (!v || !c) return
    c.width = v.videoWidth || 640; c.height = v.videoHeight || 480
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height)
    setPhotos(p => [...p, { src: c.toDataURL('image/png') }])
    toast.success('Photo captured!')
  }

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    const b64s = await Promise.all(files.map(fileToBase64))
    setPhotos(p => [...p, ...b64s.map(src => ({ src }))])
    toast.success(`${files.length} photo(s) added`)
  }

  const removePhoto = (idx) => setPhotos(p => p.filter((_, i) => i !== idx))

  const handleDone = () => {
    if (photos.length === 0) { toast.error('Add at least one photo'); return }
    onAdd(photos.map(p => p.src))
    stopCam()
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,22,80,0.5)', backdropFilter: 'blur(8px)', padding: '16px' }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '24px 22px', width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 60px rgba(132,148,255,0.2)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1e1660', margin: '0 0 2px' }}>Add Photos</h3>
            <p style={{ fontSize: '12px', color: 'rgba(45,32,96,0.5)', margin: 0 }}>Capture or upload classroom photos</p>
          </div>
          <button onClick={onClose} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'rgba(201,190,255,0.25)', color: '#7c6bbf', fontSize: '14px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['camera', 'upload'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ flex: 1, padding: '9px', borderRadius: '12px', border: `2px solid ${mode === m ? '#8494FF' : '#e0daff'}`, background: mode === m ? 'rgba(132,148,255,0.1)' : 'transparent', color: mode === m ? '#8494FF' : '#9b8ec4', fontWeight: '700', fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize' }}>
              {m === 'camera' ? '📷 Camera' : '📁 Upload'}
            </button>
          ))}
        </div>

        {/* Camera */}
        {mode === 'camera' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#1a1632', aspectRatio: '4/3', position: 'relative' }}>
              <video ref={videoRef} autoPlay playsInline muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: cameraReady ? 'block' : 'none' }} />
              {!cameraReady && !cameraError && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9b8ec4', fontSize: '13px' }}>Starting camera...</div>
              )}
              {cameraError && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff7eb3', fontSize: '13px', padding: '16px', textAlign: 'center' }}>{cameraError}</div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <button onClick={takePhoto} disabled={!cameraReady}
              style={{ padding: '11px', borderRadius: '12px', border: 'none', background: cameraReady ? 'linear-gradient(135deg,#8494FF,#7081f5)' : '#c4b8ff', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: cameraReady ? 'pointer' : 'not-allowed' }}>
              📸 Take Photo
            </button>
          </div>
        )}

        {/* Upload */}
        {mode === 'upload' && (
          <div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()}
              style={{ width: '100%', padding: '32px 16px', borderRadius: '12px', border: '2px dashed rgba(132,148,255,0.4)', background: 'rgba(132,148,255,0.04)', color: '#8494FF', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '28px' }}>🖼️</span>
              Click to select photos
              <span style={{ fontSize: '11px', fontWeight: '400', color: '#9b8ec4' }}>PNG, JPG, WEBP supported</span>
            </button>
          </div>
        )}

        {/* Captured photos */}
        {photos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#3d2e8e', margin: 0 }}>{photos.length} photo(s) ready</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {photos.map((p, i) => <Thumb key={i} src={p.src} idx={i} onRemove={removePhoto} />)}
            </div>
          </div>
        )}

        <button onClick={handleDone}
          style={{ padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#8494FF,#7081f5)', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(132,148,255,0.3)' }}>
          Done — Use {photos.length} Photo{photos.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  )
}

// ── Voice Modal ───────────────────────────────────────────────────────────────
function VoiceModal({ subjectId, onClose, onResult }) {
  const mrRef     = useRef(null)
  const chunksRef = useRef([])
  const timerRef  = useRef(null)

  const [recording, setRecording] = useState(false)
  const [audioB64,  setAudioB64]  = useState(null)
  const [seconds,   setSeconds]   = useState(0)
  const [analyzing, setAnalyzing] = useState(false)

  const startRec = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(s)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => { setAudioB64(reader.result); s.getTracks().forEach(t => t.stop()) }
        reader.readAsDataURL(blob)
      }
      mrRef.current = mr
      mr.start()
      setRecording(true); setSeconds(0)
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } catch { toast.error('Microphone access denied') }
  }

  const stopRec = () => {
    mrRef.current?.stop()
    clearInterval(timerRef.current)
    setRecording(false)
  }

  useEffect(() => () => { clearInterval(timerRef.current) }, [])

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const analyze = async () => {
    if (!audioB64) { toast.error('Record audio first'); return }
    setAnalyzing(true)
    try {
      const res = await fetch(`${BASE_URL}/attendance/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ subject_id: subjectId, audio_b64: audioB64 }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.detail || 'Voice analysis failed')
      onResult(json.results)
      toast.success(`Voice done — ${json.results.filter(r=>r.present).length} present`)
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally { setAnalyzing(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,22,80,0.5)', backdropFilter: 'blur(8px)', padding: '16px' }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '24px 22px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 60px rgba(132,148,255,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1e1660', margin: '0 0 2px' }}>Voice Attendance</h3>
            <p style={{ fontSize: '12px', color: 'rgba(45,32,96,0.5)', margin: 0 }}>Record students saying their names</p>
          </div>
          <button onClick={onClose} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'rgba(201,190,255,0.25)', color: '#7c6bbf', fontSize: '14px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '14px', background: 'rgba(132,148,255,0.06)', border: '1.5px solid rgba(132,148,255,0.2)' }}>
          <button onClick={recording ? stopRec : startRec}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: recording ? 'linear-gradient(135deg,#ff7eb3,#e0567a)' : 'linear-gradient(135deg,#8494FF,#7081f5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {recording
              ? <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#fff' }} />
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
            }
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2px', height: '24px' }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} style={{ width: '3px', borderRadius: '2px', background: recording ? '#8494FF' : 'rgba(132,148,255,0.3)', height: recording ? `${Math.random() * 18 + 4}px` : '3px', transition: 'height 0.15s', flexShrink: 0 }} />
            ))}
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: recording ? '#e0567a' : '#9b8ec4', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{fmt(seconds)}</span>
        </div>

        {audioB64 && !recording && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '600', color: '#4caf7d' }}>
            <span>✓</span> Audio ready ({fmt(seconds)})
          </div>
        )}

        <button onClick={analyze} disabled={!audioB64 || analyzing}
          style={{ padding: '12px', borderRadius: '12px', border: 'none', background: (!audioB64 || analyzing) ? '#c4b8ff' : 'linear-gradient(135deg,#8494FF,#7081f5)', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: (!audioB64 || analyzing) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {analyzing ? <><Spin />Analyzing...</> : <>🎙️ Analyze Audio</>}
        </button>
      </div>
    </div>
  )
}

// ── Results Table ─────────────────────────────────────────────────────────────
function ResultsTable({ results }) {
  if (!results || results.length === 0) return null
  const presentCount = results.filter(r => r.present).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.4s ease both' }}>
      {/* Summary */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total',   val: results.length,               color: '#8494FF', bg: 'rgba(132,148,255,0.1)',  border: 'rgba(132,148,255,0.25)' },
          { label: 'Present', val: presentCount,                 color: '#4caf7d', bg: 'rgba(76,175,125,0.1)',   border: 'rgba(76,175,125,0.3)' },
          { label: 'Absent',  val: results.length - presentCount, color: '#e0567a', bg: 'rgba(224,86,122,0.08)', border: 'rgba(224,86,122,0.25)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '10px 18px', borderRadius: '14px', background: s.bg, border: `1.5px solid ${s.border}`, textAlign: 'center', minWidth: '72px' }}>
            <p style={{ fontSize: '22px', fontWeight: '900', color: s.color, margin: 0, lineHeight: 1 }}>{s.val}</p>
            <p style={{ fontSize: '10px', fontWeight: '600', color: s.color, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1.5px solid rgba(201,190,255,0.4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '8px 16px', background: 'rgba(132,148,255,0.08)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8494FF' }}>
          <span>Student</span><span>Status</span>
        </div>
        {results.map((r, i) => (
          <div key={r.student_id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 16px', alignItems: 'center', background: i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(248,246,255,0.7)', borderTop: '1px solid rgba(201,190,255,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg,#8494FF,#a78bff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '800', flexShrink: 0 }}>
                {r.student_name?.slice(0, 2).toUpperCase() || '??'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d2060' }}>{r.student_name}</span>
            </div>
            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', color: r.present ? '#4caf7d' : '#e0567a', background: r.present ? 'rgba(76,175,125,0.12)' : 'rgba(224,86,122,0.1)', border: `1px solid ${r.present ? 'rgba(76,175,125,0.3)' : 'rgba(224,86,122,0.25)'}` }}>
              {r.present ? '✓ Present' : '✗ Absent'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function TakeAttendanceTab({ subjects }) {
  const [selectedSubject, setSelected] = useState('')
  const [photos,    setPhotos]          = useState([])
  const [results,   setResults]         = useState(null)
  const [analyzing, setAnalyzing]       = useState(false)
  const [showPhoto, setShowPhoto]       = useState(false)
  const [showVoice, setShowVoice]       = useState(false)

  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) setSelected(String(subjects[0].subject_id))
  }, [subjects])

  const noSubject  = subjects.length === 0
  const noSelected = !selectedSubject
  const noPhotos   = photos.length === 0

  const clearAll = () => { setPhotos([]); setResults(null) }

  const runFaceAnalysis = async () => {
    if (!selectedSubject) { toast.error('Select a subject first'); return }
    if (photos.length === 0) { toast.error('Add at least one photo first'); return }
    setAnalyzing(true); setResults(null)
    try {
      const res = await fetch(`${BASE_URL}/attendance/face`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ subject_id: parseInt(selectedSubject), images_b64: photos }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.detail || 'Face analysis failed')
      setResults(json.results)
      toast.success(`Done — ${json.results.filter(r=>r.present).length} present`)
    } catch (err) {
      toast.error(err.message)
    } finally { setAnalyzing(false) }
  }

  const btn = (bg, disabled) => ({
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '10px 18px', borderRadius: '50px', border: 'none',
    background: disabled ? 'rgba(180,180,200,0.2)' : bg,
    color: disabled ? '#bbb' : '#fff',
    fontSize: '13px', fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    boxShadow: disabled ? 'none' : '0 3px 12px rgba(0,0,0,0.15)',
    flexShrink: 0,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* Title */}
      <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#2d2060', margin: 0, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.02em' }}>
        Take AI Attendance
      </h2>

      {/* No subjects warning */}
      {noSubject && (
        <div style={{ padding: '12px 16px', borderRadius: '14px', background: 'rgba(255,126,179,0.08)', border: '1.5px solid rgba(255,126,179,0.3)', color: '#e0567a', fontSize: '13px', fontWeight: '600' }}>
          ⚠️ No subjects yet. Create a subject first.
        </div>
      )}

      {/* Subject + Add Photos row */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '180px' }}>
          <label style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(45,32,96,0.6)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Subject</label>
          <select
            value={selectedSubject}
            onChange={e => { setSelected(e.target.value); setResults(null); setPhotos([]) }}
            disabled={noSubject}
            style={{ padding: '10px 14px', borderRadius: '12px', border: '1.5px solid rgba(201,190,255,0.5)', background: noSubject ? '#f5f0ff' : '#fff', color: '#2d2060', fontSize: '13px', fontWeight: '600', cursor: noSubject ? 'not-allowed' : 'pointer', outline: 'none' }}
          >
            {noSubject
              ? <option>No subjects available</option>
              : subjects.map(s => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.name} — {s.subject_code}
                  </option>
                ))
            }
          </select>
        </div>

        <button
          onClick={() => setShowPhoto(true)}
          disabled={noSelected || noSubject}
          style={btn('linear-gradient(135deg,#8494FF,#7081f5)', noSelected || noSubject)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          Add Photos {photos.length > 0 && `(${photos.length})`}
        </button>
      </div>

      {/* Photo thumbnails */}
      {photos.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px', borderRadius: '14px', background: 'rgba(132,148,255,0.05)', border: '1.5px dashed rgba(132,148,255,0.25)', animation: 'slideUp 0.3s ease both' }}>
          {photos.map((src, i) => (
            <Thumb key={i} src={src} idx={i} onRemove={idx => setPhotos(p => p.filter((_, ii) => ii !== idx))} />
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(201,190,255,0.5),transparent)' }} />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={clearAll}
          disabled={noPhotos && !results}
          style={btn('#1e1660', noPhotos && !results)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Clear
        </button>

        <button
          onClick={runFaceAnalysis}
          disabled={noPhotos || analyzing || noSubject}
          style={btn('linear-gradient(135deg,#e0567a,#ff7eb3)', noPhotos || analyzing || noSubject)}
        >
          {analyzing ? <Spin /> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h.01M15 9h.01M9 15h6"/></svg>}
          {analyzing ? 'Analyzing...' : 'Run Face Analysis'}
        </button>

        <button
          onClick={() => setShowVoice(true)}
          disabled={noSubject || noSelected}
          style={btn('linear-gradient(135deg,#8494FF,#a78bff)', noSubject || noSelected)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
          Voice Attendance
        </button>
      </div>

      {/* Results */}
      <ResultsTable results={results} />

      {/* Modals */}
      {showPhoto && (
        <PhotoModal
          onClose={() => setShowPhoto(false)}
          onAdd={newPhotos => setPhotos(p => [...p, ...newPhotos])}
        />
      )}
      {showVoice && (
        <VoiceModal
          subjectId={parseInt(selectedSubject)}
          onClose={() => setShowVoice(false)}
          onResult={setResults}
        />
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}