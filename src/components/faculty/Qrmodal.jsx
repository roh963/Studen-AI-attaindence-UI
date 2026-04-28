import toast from 'react-hot-toast'
import { subjectAPI } from '../../services/api'

export default function QRModal({ subject, onClose }) {
  const joinUrl = `${window.location.origin}/student-login?join=${subject.subject_id}`
  const qrSrc   = subjectAPI.qrUrl(subject.subject_id)

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl)
    toast.success('Link copied!')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: 'rgba(30,22,80,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm glass-strong rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8494FF' }}>
              Join Subject
            </p>
            <h3 className="text-lg font-black" style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}>
              {subject.name}
            </h3>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#9b8ec4' }}>
              {subject.subject_code} · Section {subject.section}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110 shrink-0"
            style={{ background: 'rgba(201,190,255,0.2)', color: '#7c6bbf' }}
          >
            ✕
          </button>
        </div>

        {/* QR Image */}
        <div
          className="rounded-2xl overflow-hidden p-3"
          style={{ background: '#f5f0ff', border: '2px solid rgba(132,148,255,0.2)' }}
        >
          <img src={qrSrc} alt="QR Code" className="w-44 h-44 sm:w-48 sm:h-48 object-contain" />
        </div>

        <p className="text-xs text-center font-medium" style={{ color: '#9b8ec4' }}>
          Student scan karega → Student Login page pe jaayega → Login ke baad automatically enroll ho jaayega
        </p>

        {/* Join Link */}
        <div
          className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(132,148,255,0.08)', border: '1.5px solid rgba(132,148,255,0.2)' }}
        >
          <span className="text-xs font-medium truncate flex-1" style={{ color: '#6b5fe0' }}>
            {joinUrl}
          </span>
          <button
            onClick={copyLink}
            className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition hover:scale-105"
            style={{ background: '#8494FF' }}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}