import { getProjects } from '@/lib/kv'
import ProjectGrid from './ProjectGrid'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const projects = await getProjects()

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo"><span>&lt;</span>Pratik Ranjan<span>/&gt;</span></Link>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-badge">Open to opportunities</div>
        <h1>Building things that<br /><em>actually matter</em></h1>
        <p>I&apos;m a developer who turns ideas into polished products. Here&apos;s a curated selection of what I&apos;ve shipped.</p>
        <a href="#projects" className="btn-primary">View my work ↓</a>
      </div>

      <div className="section" id="projects">
        <div className="section-eyebrow">Selected work</div>
        <div className="section-title">Projects</div>
        <ProjectGrid projects={projects} />
      </div>

      <div className="section" id="about">
        <div className="section-eyebrow">About me</div>
        <div className="section-title">Who I am</div>
        <p style={{ color: 'var(--muted)', maxWidth: 580, fontSize: '0.95rem', lineHeight: 1.8 }}>
          Software Engineer with 5+ years of experience building AI-powered platforms, backend services, and developer productivity solutions using Python, GenAI, and cloud technologies. Experienced in LLMs, RAG, LangChain, distributed systems, and scalable application development, with a proven track record of delivering high-impact solutions.
        </p>
      </div>

      <footer>Built with care · <span style={{ opacity: 0.4 }}>©{new Date().getFullYear()}</span></footer>
    </>
  )
}
