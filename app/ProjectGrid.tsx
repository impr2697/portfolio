'use client'

import { Project } from '@/lib/kv'

function glowCard(e: React.MouseEvent<HTMLDivElement>, el: HTMLDivElement) {
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%')
  el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%')
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return (
      <div className="project-grid">
        <div className="empty-state">
          <div className="empty-icon">🛠</div>
          <p>No projects yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="project-grid">
      {projects.map(p => (
        <div
          key={p.id}
          className="project-card"
          onMouseMove={e => glowCard(e, e.currentTarget)}
        >
          {p.tag && <div className="card-tag">{p.tag}</div>}
          <div className="card-title">{p.name}</div>
          <div className="card-desc">{p.desc}</div>
          <div className="card-links">
            {p.liveUrl && (
              <a className="card-link cl-live" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                Live ↗
              </a>
            )}
            {p.githubUrl && (
              <a className="card-link cl-gh" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {!p.liveUrl && !p.githubUrl && (
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>No links</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
