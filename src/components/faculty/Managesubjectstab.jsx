import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { subjectAPI } from '../../services/api.js'
import QRModal from './Qrmodal.jsx'

// ── Icon helpers ───────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const QRIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3M17 20h3M20 17h-3" />
  </svg>
)
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
export default function ManageSubjectsTab() {
  const [subjects,    setSubjects]  = useState([])
  const [loading,     setLoading]   = useState(true)
  const [showForm,    setShowForm]  = useState(false)
  const [editTarget,  setEdit]      = useState(null)
  const [qrSubject,   setQrSubject] = useState(null)
  const [form,        setForm]      = useState({ subject_code: '', name: '', section: '' })
  const [saving,      setSaving]    = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try   { setSubjects(await subjectAPI.list()) }
    catch { toast.error('Failed to load subjects') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setForm({ subject_code: '', name: '', section: '' })
    setEdit(null)
    setShowForm(false)
  }

  const openEdit = (s) => {
    setForm({ subject_code: s.subject_code, name: s.name, section: s.section })
    setEdit(s)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.subject_code.trim() || !form.name.trim() || !form.section.trim()) {
      toast.error('All fields are required')
      return
    }
    setSaving(true)
    try {
      if (editTarget) {
        await subjectAPI.update(editTarget.subject_id, form)
        toast.success('Subject updated!')
      } else {
        await subjectAPI.create(form)
        toast.success('Subject created!')
      }
      resetForm()
      load()
    } catch (e) {
      toast.error(e?.detail || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject? All attendance records will be removed.')) return
    try {
      await subjectAPI.delete(id)
      toast.success('Subject deleted')
      load()
    } catch (e) {
      toast.error(e?.detail || 'Delete failed')
    }
  }

  const updateField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: '#2d2060' }}>
          Manage Subjects
        </h2>
        <button
          onClick={() => { resetForm(); setShowForm(v => !v) }}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 shrink-0"
          style={{ background: 'linear-gradient(135deg,#8494FF,#a78bff)', boxShadow: '0 4px 16px rgba(132,148,255,0.4)' }}
        >
          <PlusIcon />
          <span className="hidden xs:inline">{showForm && !editTarget ? 'Cancel' : 'New Subject'}</span>
          <span className="xs:hidden">{showForm && !editTarget ? '✕' : 'New'}</span>
        </button>
      </div>

      {/* ── Create / Edit Form ── */}
      {showForm && (
        <div className="glass rounded-3xl p-5 sm:p-6 mb-6 flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8494FF' }}>
            {editTarget ? 'Edit Subject' : 'Create Subject'}
          </p>

          {/* Responsive: 1 col on mobile, 3 col on md+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'subject_code', label: 'Subject Code', placeholder: 'CS101' },
              { key: 'name',         label: 'Subject Name', placeholder: 'Data Structures' },
              { key: 'section',      label: 'Section',      placeholder: 'A' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: '#3d2e8e' }}>{label}</label>
                <input
                  className="w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all duration-200 input-field"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={updateField(key)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#8494FF,#7081f5)', boxShadow: '0 4px 16px rgba(132,148,255,0.35)' }}
            >
              {saving ? 'Saving…' : editTarget ? 'Update Subject' : 'Create Subject'}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(201,190,255,0.2)', color: '#6b5fe0', border: '1.5px solid rgba(201,190,255,0.5)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Subject List ── */}
      {loading ? (
        <p className="text-sm font-medium text-center py-10" style={{ color: '#9b8ec4' }}>Loading subjects…</p>
      ) : subjects.length === 0 ? (
        <div className="rounded-xl px-5 py-4 text-sm font-medium" style={{ background: 'rgba(201,190,255,0.2)', color: '#7c6bbf' }}>
          No subjects yet. Create your first subject above!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {subjects.map(s => (
            <SubjectRow
              key={s.subject_id}
              subject={s}
              onEdit={() => openEdit(s)}
              onDelete={() => handleDelete(s.subject_id)}
              onQR={() => setQrSubject(s)}
            />
          ))}
        </div>
      )}

      {/* ── QR Modal ── */}
      {qrSubject && <QRModal subject={qrSubject} onClose={() => setQrSubject(null)} />}
    </div>
  )
}

// ── Sub-component: single subject row ─────────────────────────────────────────
function SubjectRow({ subject: s, onEdit, onDelete, onQR }) {
  return (
    <div className="glass rounded-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left info */}
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#8494FF,#a78bff)' }}
        >
          {s.subject_code.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#2d2060' }}>{s.name}</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#9b8ec4' }}>
            {s.subject_code} · Section {s.section}
          </p>
        </div>
      </div>

      {/* Action buttons — scroll horizontally on very small screens */}
      <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-0.5 sm:pb-0">
        <ActionBtn onClick={onQR} color="purple" icon={<QRIcon />} label="QR Code" />
        <ActionBtn onClick={onEdit} color="lavender" icon={<EditIcon />} label="Edit" />
        <ActionBtn onClick={onDelete} color="pink" icon={<TrashIcon />} label="Delete" />
      </div>
    </div>
  )
}

// ── Tiny reusable action button ────────────────────────────────────────────────
const colorMap = {
  purple:  { bg: 'rgba(132,148,255,0.12)', text: '#6b5fe0', border: 'rgba(132,148,255,0.25)' },
  lavender:{ bg: 'rgba(201,190,255,0.15)', text: '#7c6bbf', border: 'rgba(201,190,255,0.4)'  },
  pink:    { bg: 'rgba(255,126,179,0.08)', text: '#e0567a', border: 'rgba(255,126,179,0.25)' },
}

function ActionBtn({ onClick, color, icon, label }) {
  const c = colorMap[color]
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 whitespace-nowrap"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {icon}{label}
    </button>
  )
}