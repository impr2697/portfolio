import { NextRequest, NextResponse } from 'next/server'
import { getPwHash, setPwHash } from '@/lib/kv'
import { sha256 } from '@/lib/hash'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { current, newPassword } = await req.json()
  const stored = await getPwHash()
  if (!stored) return NextResponse.json({ error: 'No password set' }, { status: 400 })
  if (await sha256(current) !== stored) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
  if (!newPassword || newPassword.length < 8) return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
  await setPwHash(await sha256(newPassword))
  return NextResponse.json({ ok: true })
}
