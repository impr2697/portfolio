'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginClient({ needsSetup }: { needsSetup: boolean }) {
  const router = useRouter()
  const [isSetup, setIsSetup] = useState(needsSetup)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setErr(''); setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password: pw }),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error); setLoading(false); setPw(''); return }
      router.push('/admin')
    } catch { setErr('Something went wrong.'); setLoading(false) }
  }

  async function handleSetup() {
    setErr('')
    if (pw.length < 8) { setErr('Password must be at least 8 characters.'); return }
    if (pw !== pw2)    { setErr('Passwords do not match.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup', password: pw }),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error); setLoading(false); return }
      router.push('/admin')
    } catch { setErr('Something went wrong.'); setLoading(false) }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo"><span>&lt;</span>dev<span>/&gt;</span> admin</div>

        {isSetup ? (
          <>
            <h1>Set your password</h1>
            <p className="sub">First time here — create a password to protect the admin panel.</p>
            <div className="form-group">
              <label className="form-label">New password</label>
              <input
                type="password" className="form-input" placeholder="At least 8 characters"
                value={pw} onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSetup()}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <input
                type="password" className="form-input" placeholder="Repeat password"
                value={pw2} onChange={e => setPw2(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSetup()}
              />
            </div>
            <button className="btn-full" onClick={handleSetup} disabled={loading}>
              {loading ? 'Setting up…' : 'Set password & sign in'}
            </button>
          </>
        ) : (
          <>
            <h1>Admin sign in</h1>
            <p className="sub">Enter your password to access the dashboard.</p>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" className="form-input" placeholder="••••••••"
                value={pw} onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
            </div>
            <button className="btn-full" onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </>
        )}

        {err && <p className="msg msg-err">{err}</p>}
        <a href="/" className="back-link">← Back to portfolio</a>
      </div>
    </div>
  )
}
