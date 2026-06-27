import { NextRequest, NextResponse } from 'next/server'
import { getPwHash, setPwHash } from '@/lib/kv'
import { sha256 } from '@/lib/hash'
import { createSession, destroySession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { action, password, newPassword } = await req.json()

  if (action === 'check-setup') {
    const hash = await getPwHash()
    return NextResponse.json({ needsSetup: !hash })
  }

  if (action === 'setup') {
    const existing = await getPwHash()
    if (existing) return NextResponse.json({ error: 'Already set up' }, { status: 400 })
    if (!password || password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    await setPwHash(await sha256(password))
    await createSession()
    return NextResponse.json({ ok: true })
  }

  if (action === 'login') {
    const stored = await getPwHash()
    if (!stored) return NextResponse.json({ error: 'Not set up yet' }, { status: 400 })
    const hash = await sha256(password)
    if (hash !== stored) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    await createSession()
    return NextResponse.json({ ok: true })
  }

  if (action === 'logout') {
    await destroySession()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
