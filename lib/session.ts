import { cookies } from 'next/headers'

const SECRET = process.env.SESSION_SECRET ?? 'dev_secret_change_me'
const COOKIE = 'pf_session'
const TTL_MS = 4 * 60 * 60 * 1000 // 4 hours

async function sign(payload: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  const b64 = Buffer.from(sig).toString('base64url')
  return `${payload}.${b64}`
}

async function verify(token: string): Promise<boolean> {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return false
  const payload = token.slice(0, dot)
  const expected = await sign(payload)
  return expected === token
}

export async function createSession(): Promise<void> {
  const payload = String(Date.now() + TTL_MS)
  const token = await sign(payload)
  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TTL_MS / 1000,
    path: '/',
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE)
}

export async function getSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE)?.value
  if (!token) return false
  if (!(await verify(token))) return false
  const dot = token.lastIndexOf('.')
  const exp = Number(token.slice(0, dot))
  return Date.now() < exp
}
