'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@/lib/kv'

type Panel = 'projects' | 'add' | 'password'

export default function AdminClient({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter()
  const [panel, setPanel] = useState<Panel>('projects')
  const [projects, setProjects] = useState(initialProjects)

  // Add form
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [desc, setDesc] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [addMsg, setAddMsg] = useState<{ type: 'ok'|'err', text: string } | null>(null)
  const [addLoading, setAddLoading] = useState(false)

  // Password form
  const [curPw, setCurPw] = useState('')
  const [newPw1, setNewPw1] = useState('')
  const [newPw2, setNewPw2] = useState('')
  const [pwMsg, setPwMsg] = useState<{ type: 'ok'|'err', text: string } | null>(null)
  const [pwLoading, setPwLoading] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) })
    router.push('/')
  }

  async function handleDelete(id: number) {
    const res = await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setProjects(p => p.filter(x => x.id !== id))
  }

  async function handleAdd() {
    setAddMsg(null)
    if (!name || !desc) { setAddMsg({ type: 'err', text: 'Name and description are required.' }); return }
    setAddLoading(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tag, desc, liveUrl, githubUrl }),
    })
    const data = await res.json()
    if (!res.ok) { setAddMsg({ type: 'err', text: data.error }); setAddLoading(false); return }
    setProjects(p => [...p, data])
    setName(''); setTag(''); setDesc(''); setLiveUrl(''); setGithubUrl('')
    setAddMsg({ type: 'ok', text: 'Project added!' })
    setAddLoading(false)
    setTimeout(() => setAddMsg(null), 2500)
  }

  async function handleChangePw() {
    setPwMsg(null)
    if (!curPw) { setPwMsg({ type: 'err', text: 'Enter your current password.' }); return }
    if (newPw1.length < 8) { setPwMsg({ type: 'err', text: 'New password must be at least 8 characters.' }); return }
    if (newPw1 !== newPw2) { setPwMsg({ type: 'err', text: 'New passwords do not match.' }); return }
    setPwLoading(true)
    const res = await fetch('/api/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: curPw, newPassword: newPw1 }),
    })
    const data = await res.json()
    if (!res.ok) { setPwMsg({ type: 'err', text: data.error }); setPwLoading(false); return }
    setCurPw(''); setNewPw1(''); setNewPw2('')
    setPwMsg({ type: 'ok', text: 'Password updated!' })
    setPwLoading(false)
    setTimeout(() => setPwMsg(null), 2500)
  }

  function switchPanel(p: Panel) {
    setPanel(p)
    setAddMsg(null); setPwMsg(null)
  }

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="sidebar-logo"><span>&lt;</span>dev<span>/&gt;</span></div>
        {(['projects','add','password'] as Panel[]).map(p => (
          <button key={p} className={`side-btn${panel === p ? ' active' : ''}`} onClick={() => switchPanel(p)}>
            {{ projects: 'Projects', add: 'Add project', password: 'Change password' }[p]}
          </button>
        ))}
        <button className="side-btn danger" style={{ marginTop: 'auto' }} onClick={handleLogout}>Sign out</button>
      </aside>

      <main className="admin-main">

        {/* MANAGE */}
        {panel === 'projects' && (
          <div>
            <div className="panel-title">Projects</div>
            <div className="panel-sub">Manage what appears on your portfolio.</div>
            {projects.length === 0
              ? <p className="no-items">No projects yet — add one using the sidebar.</p>
              : projects.map(p => (
                <div key={p.id} className="project-item">
                  <div className="pi-info">
                    <div className="pi-name">{p.name}</div>
                    <div className="pi-tag">{p.tag || 'No tag'}</div>
                  </div>
                  <button className="del-btn" onClick={() => handleDelete(p.id)}>Remove</button>
                </div>
              ))
            }
          </div>
        )}

        {/* ADD */}
        {panel === 'add' && (
          <div>
            <div className="panel-title">Add project</div>
            <div className="panel-sub">New projects appear immediately on the public portfolio.</div>
            <div className="add-grid">
              <div className="form-group span2">
                <label className="form-label">Project name *</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="My awesome project" />
              </div>
              <div className="form-group">
                <label className="form-label">Category / tag</label>
                <input className="form-input" value={tag} onChange={e => setTag(e.target.value)} placeholder="Web App, API, Tool…" />
              </div>
              <div className="form-group">
                <label className="form-label">Live URL</label>
                <input className="form-input" type="url" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://myproject.com" />
              </div>
              <div className="form-group span2">
                <label className="form-label">GitHub URL</label>
                <input className="form-input" type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/you/repo" />
              </div>
              <div className="form-group span2">
                <label className="form-label">Description *</label>
                <textarea className="form-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What does this project do?" />
              </div>
            </div>
            <button className="btn-full" onClick={handleAdd} disabled={addLoading}>
              {addLoading ? 'Adding…' : 'Add project'}
            </button>
            {addMsg && <p className={`msg msg-${addMsg.type}`}>{addMsg.text}</p>}
          </div>
        )}

        {/* PASSWORD */}
        {panel === 'password' && (
          <div>
            <div className="panel-title">Change password</div>
            <div className="panel-sub">Your password is stored as a SHA-256 hash in Vercel KV.</div>
            <div style={{ maxWidth: 360 }}>
              <div className="form-group">
                <label className="form-label">Current password</label>
                <input type="password" className="form-input" value={curPw} onChange={e => setCurPw(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">New password</label>
                <input type="password" className="form-input" value={newPw1} onChange={e => setNewPw1(e.target.value)} placeholder="At least 8 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm new password</label>
                <input type="password" className="form-input" value={newPw2} onChange={e => setNewPw2(e.target.value)}
                  placeholder="Repeat" onKeyDown={e => e.key === 'Enter' && handleChangePw()} />
              </div>
              <button className="btn-full" onClick={handleChangePw} disabled={pwLoading}>
                {pwLoading ? 'Updating…' : 'Update password'}
              </button>
              {pwMsg && <p className={`msg msg-${pwMsg.type}`}>{pwMsg.text}</p>}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
