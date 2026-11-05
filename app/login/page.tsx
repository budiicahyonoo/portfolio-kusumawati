'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const result = await res.json().catch(() => null)
        setError(result?.error || 'Sign-in failed. Check your credentials and configuration.')
      }
    } catch {
      setError('Unable to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-sm w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-primary-950 mb-2">Admin sign in</h1>
          <p className="text-sm text-neutral-700">Sign in to manage the portfolio.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <label htmlFor="admin-password" className="block text-sm font-medium text-neutral-800">Password</label>
          <Input
            id="admin-password"
            required
            autoComplete="current-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-sm"
          />
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          
          <Button type="submit" className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-md min-h-11" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}