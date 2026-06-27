import { NextRequest, NextResponse } from 'next/server'
import { getProjects, saveProjects } from '@/lib/kv'
import { getSession } from '@/lib/session'

// Public: list all projects
export async function GET() {
  const projects = await getProjects()
  return NextResponse.json(projects)
}

// Admin: add project
export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, tag, desc, liveUrl, githubUrl } = await req.json()
  if (!name || !desc) return NextResponse.json({ error: 'Name and description required' }, { status: 400 })
  const projects = await getProjects()
  const project = { id: Date.now(), name, tag: tag ?? '', desc, liveUrl: liveUrl ?? '', githubUrl: githubUrl ?? '' }
  projects.push(project)
  await saveProjects(projects)
  return NextResponse.json(project, { status: 201 })
}

// Admin: delete project
export async function DELETE(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const projects = await getProjects()
  await saveProjects(projects.filter(p => p.id !== id))
  return NextResponse.json({ ok: true })
}
