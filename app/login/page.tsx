import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginClient from './LoginClient'
import { getPwHash } from '@/lib/kv'

export default async function LoginPage() {
  if (await getSession()) redirect('/admin')
  const needsSetup = !(await getPwHash())
  return <LoginClient needsSetup={needsSetup} />
}
