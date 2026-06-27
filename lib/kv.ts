import { kv } from '@vercel/kv'

export const KV_PROJECTS = 'portfolio:projects'
export const KV_PW_HASH  = 'portfolio:pw_hash'

export interface Project {
  id: number
  name: string
  tag: string
  desc: string
  liveUrl: string
  githubUrl: string
}

export async function getProjects(): Promise<Project[]> {
  const data = await kv.get<Project[]>(KV_PROJECTS)
  return data ?? []
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await kv.set(KV_PROJECTS, projects)
}

export async function getPwHash(): Promise<string | null> {
  return kv.get<string>(KV_PW_HASH)
}

export async function setPwHash(hash: string): Promise<void> {
  await kv.set(KV_PW_HASH, hash)
}
