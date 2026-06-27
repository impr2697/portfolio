import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getProjects } from '@/lib/kv'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await getSession())) redirect('/login')
  const projects = await getProjects()
  return <AdminClient initialProjects={projects} />
}
