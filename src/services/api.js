// src/services/api.js
import { create } from 'zustand'

const BASE_URL = import.meta.env.VITE_API_URL

// ── Zustand Student Store ──────────────────────────────────────────────────────
export const useStudentStore = create((set) => ({
  student: null,
  setStudent: (student) => set({ student }),
  clearStudent: () => set({ student: null }),
}))

// ── Auth headers helper ────────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// ── Auth API ───────────────────────────────────────────────────────────────────
export const authAPI = {

  signup: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        username: data.username,
        password: data.password,
        confirm_password: data.confirm,
      }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Signup failed')
    return json
  },

  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Login failed')
    return json  // { access_token, token_type }
  },
}

// ── Student API ────────────────────────────────────────────────────────────────
export const studentAPI = {

  login: async (image_b64) => {
    const res = await fetch(`${BASE_URL}/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_b64 }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Login failed')
    return json
  },

  create: async (name, image_b64, audio_b64 = null) => {
    const res = await fetch(`${BASE_URL}/student/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        image_b64,
        ...(audio_b64 && { audio_b64 }),
      }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Could not create profile')
    return json
  },

  // QR scan ke baad student ko subject mein enroll karo
  enroll: async (subject_id, student_id) => {
    const res = await fetch(
      `${BASE_URL}/subject/${subject_id}/enroll?student_id=${student_id}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Enrollment failed')
    return json
  },
}

// ── Subject API ────────────────────────────────────────────────────────────────
export const subjectAPI = {

  list: async () => {
    const res = await fetch(`${BASE_URL}/subject/`, { headers: authHeaders() })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Failed to fetch subjects')
    return json
  },

  create: async (data) => {
    const res = await fetch(`${BASE_URL}/subject/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Failed to create subject')
    return json
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/subject/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Failed to update subject')
    return json
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/subject/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.detail || 'Failed to delete subject')
    }
  },

  // Backend se PNG QR image aati hai — seedha <img src> mein use karo
  qrUrl: (id) =>
    `${BASE_URL}/subject/${id}/qr?base_url=${encodeURIComponent(window.location.origin)}&token=${localStorage.getItem('access_token')}`,

  records: async () => {
    const res = await fetch(`${BASE_URL}/subject/attendance/records`, {
      headers: authHeaders(),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || 'Failed to fetch records')
    return json
  },
}