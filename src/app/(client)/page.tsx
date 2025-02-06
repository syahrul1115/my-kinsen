import { auth } from '@/utils/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  // CHECK AUTHENTICATED USER LOGIN
  const authenticated = await auth.api.getSession({
    headers: await headers()
  })

  if (authenticated) {
    redirect('/app') // REDIRECT TO APPLICATION PAGE
  }

  return redirect('/login') // REDIRECT TO LOGIN PAGE
}
