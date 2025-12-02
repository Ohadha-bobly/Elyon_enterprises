'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { AuthContext } from '@/context/auth-context'
import { useContext } from 'react'

export default function Home() {
  const router = useRouter()
  const auth = useContext(AuthContext)

  useEffect(() => {
    if (auth?.session) {
      router.push('/dashboard')
    }
  }, [auth?.session, router])

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </main>
  )
}
