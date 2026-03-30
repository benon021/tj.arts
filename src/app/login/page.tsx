'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegister, setIsRegister] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let authUser = null;
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined,
          }
        })
        if (error) throw error
        
        // Auto-login after signup
        if (data.session) {
          authUser = data.session.user;
        } else {
          // If session not returned, sign in manually
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
          if (signInError) throw signInError
          authUser = signInData.user;
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        authUser = data.user;
      }

      if (authUser) {
        // Fetch profile to check for admin status
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', authUser.id)
          .single()

        if (profile?.is_admin) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass p-8 rounded-3xl border border-border/50 shadow-2xl"
      >
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-serif font-bold gold-gradient italic mb-4 block">
            TJ.ARTS
          </Link>
          <h2 className="text-2xl font-bold">{isRegister ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="text-muted-foreground mt-2 font-light">
            {isRegister ? 'Join the world of cinematic art' : 'Sign in to manage your art collections'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-border/50 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-border/50 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm italic">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isRegister ? 'Register' : 'Sign In'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
