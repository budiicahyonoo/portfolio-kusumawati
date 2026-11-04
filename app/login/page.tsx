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

    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ password })
    })
    
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Invalid passkey. Access denied.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-sm w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-xl font-black tracking-wider text-blue-600 mb-2">RESTRICTED AREA</h1>
          <p className="text-xs text-slate-500">Enter master password to access the Admin CMS Dashboard.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            type="password" 
            placeholder="Master password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-center text-sm"
          />
          {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-5 text-xs" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  )
}