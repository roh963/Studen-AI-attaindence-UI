// src/pages/StudentLogin.jsx
// ============================================================
// Streamlit student_screen() ka exact React equivalent.
//
// Flow:
//   1. Webcam se photo lo (canvas capture → base64)
//   2. POST /api/student/login → face match check
//   3. Match mila → student store mein save, dashboard redirect
//   4. Naya face → registration form dikhao (name + optional voice)
//   5. Submit → POST /api/student/create → login kar do
// ============================================================

import { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { studentAPI, useStudentStore } from '../services/api.js'

// ── Spinner SVG ───────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg
    width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudentLogin() {
  const navigate = useNavigate()
  const setStudent = useStudentStore((s) => s.setStudent)

  // Camera
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(null)

  // UI state
  const [scanning, setScanning] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)   // base64 preview
  const [showRegister, setShowRegister] = useState(false)

  // Registration form
  const [regName, setRegName] = useState('')
  const [regAudio, setRegAudio] = useState(null)       // base64 audio string
  const [registering, setRegistering] = useState(false)

  // Media recorder (voice)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const [recording, setRecording] = useState(false)
  const [audioRecorded, setAudioRecorded] = useState(false)

  // ── Start webcam ────────────────────────────────────────────────────────────
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setCameraReady(true)
      }
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera permission.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }

  // ── Capture frame from webcam → base64 ─────────────────────────────────────
  // Yahi woh kaam hai jo Streamlit camera_input karta tha automatically.
  // React mein canvas.toDataURL() se same result milta hai.
  const captureFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // data:image/png;base64,XXXX  — backend strip karega prefix
    return canvas.toDataURL('image/png')
  }, [])

  // ── Scan face ───────────────────────────────────────────────────────────────
  // const handleScan = async () => {
  //   const image_b64 = captureFrame()
  //   if (!image_b64) {
  //     toast.error('Camera not ready, please wait')
  //     return
  //   }

  //   setCapturedImage(image_b64)
  //   setScanning(true)
  //   setShowRegister(false)

  //   try {
  //     const data = await studentAPI.login(image_b64)
  //     await studentAPI.enroll(joinId, data.student.student_id)

  //   if(data.found) {
  //       setStudent(data.student)
  //       toast.success(`Welcome back, ${data.student.name}! 🎉`)
  //       stopCamera()
 
  //       const params = new URLSearchParams(window.location.search)
  //       const joinId = params.get('join')
  //       if (joinId && data.student?.student_id) {
  //         try {
  //           await studentAPI.enroll(joinId, data.student.student_id)
  //           toast.success('Enrolled in subject!')
  //         } catch (err) {
  //           // Already enrolled ya subject nahi mila — silently ignore
  //           console.warn('Enroll skipped:', err.message)
  //         }
  //       }
 
  //       navigate('/student-dashboard')
  //     } else if (data.message === 'no_face') {
  //       toast.error('No face detected — position your face in center')
  //       setCapturedImage(null)

  //     } else if (data.message === 'multi_face') {
  //       toast.error('Multiple faces detected — only one person please')
  //       setCapturedImage(null)

  //     } else {
  //       // unrecognized → show registration
  //       toast('Face not recognized! Register as new student 👋', {
  //         icon: 'ℹ️',
  //         style: { background: '#eef0ff', color: '#3d2e8e', border: '1.5px solid #c9beff' },
  //       })
  //       setShowRegister(true)
  //     }
  //   } catch (err) {
  //     toast.error(err.message || 'Something went wrong')
  //     setCapturedImage(null)
  //   } finally {
  //     setScanning(false)
  //   }
  // }
  const handleScan = async () => {
    const image_b64 = captureFrame()
    if (!image_b64) {
      toast.error('Camera not ready, please wait')
      return
    }

    setCapturedImage(image_b64)
    setScanning(true)
    setShowRegister(false)

    try {
      const data = await studentAPI.login(image_b64)

      if (data.found) {
        setStudent(data.student)
        toast.success(`Welcome back, ${data.student.name}! 🎉`)
        stopCamera()

        const params = new URLSearchParams(window.location.search)
        const joinId = params.get('join')
        if (joinId && data.student?.student_id) {
          try {
            await studentAPI.enroll(joinId, data.student.student_id)
            toast.success('Enrolled in subject!')
          } catch (err) {
            console.warn('Enroll skipped:', err.message)
          }
        }

        navigate('/student-dashboard')

      } else if (data.message === 'no_face') {
        toast.error('No face detected — position your face in center')
        setCapturedImage(null)

      } else if (data.message === 'multi_face') {
        toast.error('Multiple faces detected — only one person please')
        setCapturedImage(null)

      } else {
        toast('Face not recognized! Register as new student 👋', {
          icon: 'ℹ️',
          style: { background: '#eef0ff', color: '#3d2e8e', border: '1.5px solid #c9beff' },
        })
        setShowRegister(true)
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
      setCapturedImage(null)
    } finally {
      setScanning(false)
    }
  }

  // ── Retake photo ────────────────────────────────────────────────────────────
  const handleRetake = () => {
    setCapturedImage(null)
    setShowRegister(false)
    setRegName('')
    setRegAudio(null)
    setAudioRecorded(false)
  }

  // ── Voice recording ─────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      audioChunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => {
          setRegAudio(reader.result)  // data:audio/webm;base64,XXXX
          setAudioRecorded(true)
          stream.getTracks().forEach((t) => t.stop())
        }
        reader.readAsDataURL(blob)
      }
      mediaRecorderRef.current = mr
      mr.start()
      setRecording(true)
    } catch {
      toast.error('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  // ── Register new student ─────────────────────────────────────────────────────
  // const handleRegister = async () => {
  //   if (!regName.trim()) {
  //     toast.error('Please enter your name')
  //     return
  //   }
  //   if (!capturedImage) {
  //     toast.error('No photo captured')
  //     return
  //   }

  //   setRegistering(true)
  //   try {
  //     const data = await studentAPI.create(regName.trim(), capturedImage, regAudio)
  //     setStudent(data.student)
  //     toast.success(`Profile created! Hi ${data.student.name} 🎉`)
  //     stopCamera()
  //     navigate('/student-dashboard')
  //   } catch (err) {
  //     toast.error(err.message || 'Could not create profile')
  //   } finally {
  //     setRegistering(false)
  //   }
  // }
  // handleRegister function update karo
const handleRegister = async () => {
  if (!regName.trim()) {
    toast.error('Please enter your name')
    return
  }
  if (!capturedImage) {
    toast.error('No photo captured')
    return
  }

  setRegistering(true)
  try {
    const data = await studentAPI.create(regName.trim(), capturedImage, regAudio)
    setStudent(data.student)
    toast.success(`Profile created! Hi ${data.student.name} 🎉`)
    stopCamera()

    // ✅ Register ke baad bhi join check karo
    const params = new URLSearchParams(window.location.search)
    const joinId = params.get('join')
    if (joinId && data.student?.student_id) {
      try {
        await studentAPI.enroll(joinId, data.student.student_id)
        toast.success('Enrolled in subject!')
      } catch (err) {
        console.warn('Enroll skipped:', err.message)
      }
    }

    navigate('/student-dashboard')
  } catch (err) {
    toast.error(err.message || 'Could not create profile')
  } finally {
    setRegistering(false)
  }
}

  // ── Styles ───────────────────────────────────────────────────────────────────
  const card = {
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    border: '1.5px solid rgba(201,190,255,0.5)',
    boxShadow: '0 8px 48px rgba(132,148,255,0.12)',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  }

  const btn = (primary = true, disabled = false) => ({
    width: '100%',
    padding: '14px 20px',
    borderRadius: '14px',
    border: primary ? 'none' : '1.5px solid #c4bcff',
    background: disabled
      ? '#c4b8ff'
      : primary
        ? 'linear-gradient(135deg, #8494FF, #7081f5)'
        : 'transparent',
    color: primary ? '#fff' : '#6e7fef',
    fontSize: '15px',
    fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: primary && !disabled ? '0 4px 20px rgba(132,148,255,0.4)' : 'none',
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  })

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    fontSize: '15px',
    borderRadius: '14px',
    border: '1.5px solid #d4ccff',
    background: 'rgba(255,255,255,0.8)',
    color: '#1e1660',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', sans-serif",
  }

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

      {/* Background blobs */}
      <div style={{ position: 'fixed', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(132,148,255,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-60px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,132,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={card}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #8494FF, #a78bff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(132,148,255,0.35)', flexShrink: 0,
          }}>
            {/* Face scan icon */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M9 11.5c-.828 0-1.5-.895-1.5-2S8.172 7.5 9 7.5s1.5.895 1.5 2S9.828 11.5 9 11.5zm6 0c-.828 0-1.5-.895-1.5-2s.672-2 1.5-2 1.5.895 1.5 2-.672 2-1.5 2zm-3 5.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8494FF', marginBottom: '2px' }}>
              Student Portal
            </p>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e1660', margin: 0 }}>
              Login with Face ID
            </h1>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => { stopCamera(); navigate('/') }}
          style={{ ...btn(false), padding: '10px 16px', fontSize: '13px', width: 'auto', alignSelf: 'flex-start' }}
        >
          ← Go back to Home
        </button>

        {/* Camera / Captured Image */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', border: '2px solid rgba(132,148,255,0.3)', position: 'relative', aspectRatio: '4/3', background: '#1a1632' }}>

          {/* Live video — hidden when image captured */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: capturedImage ? 'none' : 'block',
              transform: 'scaleX(-1)',   // mirror effect like Streamlit
            }}
          />

          {/* Captured frame preview */}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          )}

          {/* Camera error overlay */}
          {cameraError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26,22,50,0.9)', color: '#ff7eb3', textAlign: 'center', padding: '20px', gap: '8px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{cameraError}</p>
            </div>
          )}

          {/* Scanning overlay */}
          {scanning && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(26,22,50,0.75)', color: '#fff', gap: '12px' }}>
              <Spinner />
              <p style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>AI is scanning your face...</p>
            </div>
          )}

          {/* Face guide overlay (when live) */}
          {!capturedImage && !scanning && cameraReady && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ width: '180px', height: '220px', borderRadius: '50%', border: '2.5px dashed rgba(132,148,255,0.6)', boxShadow: '0 0 0 4px rgba(132,148,255,0.1)' }} />
            </div>
          )}
        </div>

        {/* Camera loading */}
        {!cameraReady && !cameraError && (
          <p style={{ textAlign: 'center', color: '#9b8ec4', fontSize: '14px', margin: 0 }}>
            Starting camera...
          </p>
        )}

        {/* Hint */}
        {cameraReady && !capturedImage && (
          <p style={{ textAlign: 'center', color: 'rgba(45,32,96,0.5)', fontSize: '13px', margin: 0 }}>
            Position your face in the center, then click Scan
          </p>
        )}

        {/* Action buttons */}
        {!capturedImage ? (
          <button
            onClick={handleScan}
            disabled={!cameraReady || scanning}
            style={btn(true, !cameraReady || scanning)}
          >
            {scanning ? <Spinner /> : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5z" />
              </svg>
            )}
            {scanning ? 'Scanning...' : 'Scan My Face'}
          </button>
        ) : (
          <button onClick={handleRetake} style={btn(false)}>
            📷 Retake Photo
          </button>
        )}

        {/* ── Registration form ─────────────────────────────────────── */}
        {showRegister && (
          <div style={{
            background: 'rgba(132,148,255,0.06)',
            border: '1.5px solid rgba(132,148,255,0.25)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}>

            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e1660', margin: '0 0 4px' }}>
                Register New Profile
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(45,32,96,0.55)', margin: 0 }}>
                Your face was not found. Create a new student account.
              </p>
            </div>

            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2e8e' }}>
                Your Full Name *
              </label>
              <input
                type="text"
                placeholder="E.g. Hamza Rizvi"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#8494FF')}
                onBlur={(e) => (e.target.style.borderColor = '#d4ccff')}
              />
            </div>

            {/* Voice enrollment (optional) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#3d2e8e' }}>
                Voice Enrollment <span style={{ color: '#9b8ec4', fontWeight: '400' }}>(Optional)</span>
              </label>
              <p style={{ fontSize: '12px', color: 'rgba(45,32,96,0.5)', margin: 0 }}>
                Record a short phrase like "I am present, my name is..."
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={recording ? stopRecording : startRecording}
                  style={{
                    ...btn(recording, false),
                    background: recording
                      ? 'linear-gradient(135deg, #ff7eb3, #e0567a)'
                      : 'linear-gradient(135deg, #8494FF, #7081f5)',
                    flex: 1,
                    padding: '12px',
                    boxShadow: recording ? '0 4px 16px rgba(224,86,122,0.4)' : '0 4px 16px rgba(132,148,255,0.3)',
                  }}
                >
                  {recording ? (
                    <>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite' }} />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
                      </svg>
                      {audioRecorded ? 'Re-record' : 'Record Voice'}
                    </>
                  )}
                </button>

                {audioRecorded && !recording && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0 12px',
                    borderRadius: '14px',
                    background: 'rgba(107,222,152,0.15)',
                    border: '1.5px solid rgba(107,222,152,0.4)',
                    color: '#4caf7d',
                    fontSize: '13px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}>
                    ✓ Recorded
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={registering}
              style={btn(true, registering)}
            >
              {registering ? <Spinner /> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              )}
              {registering ? 'Creating profile...' : 'Create Account'}
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}