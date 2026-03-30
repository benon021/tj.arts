'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/landing/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  AtSign,
  Pencil,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProfileData {
  id: string
  email: string
  username: string
  is_admin: boolean
  created_at: string
}

type ToastType = 'success' | 'error'

interface Toast {
  message: string
  type: ToastType
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>('profile')
  const router = useRouter()

  // Profile form
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Toast notifications
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch('/api/account', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (res.ok) {
          const data: ProfileData = await res.json()
          setProfile(data)
          setUsername(data.username || '')
          setEmail(data.email || '')
        } else {
          router.push('/login')
        }
      } catch {
        router.push('/login')
      }
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const handleSaveProfile = async () => {
    if (!profile) return
    setSavingProfile(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      showToast('Session expired. Please log in again.', 'error')
      setSavingProfile(false)
      return
    }

    let hasErrors = false

    // Update username via API
    if (username !== profile.username) {
      try {
        const res = await fetch('/api/account', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ username: username.trim() }),
        })
        const result = await res.json()
        if (!res.ok) {
          showToast(result.error || 'Failed to update username', 'error')
          hasErrors = true
        }
      } catch {
        showToast('Failed to update username', 'error')
        hasErrors = true
      }
    }

    // Update email via Supabase Auth
    if (email !== profile.email) {
      const { error } = await supabase.auth.updateUser({ email })
      if (error) {
        showToast(error.message, 'error')
        hasErrors = true
      }
    }

    if (!hasErrors) {
      setProfile(prev => prev ? { ...prev, username: username.trim(), email } : null)
      showToast('Profile updated successfully!', 'success')
    }

    setSavingProfile(false)
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }

    setSavingPassword(true)

    // Verify current password by attempting sign in
    if (!profile?.email) {
      showToast('Profile not loaded', 'error')
      setSavingPassword(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: currentPassword,
    })

    if (signInError) {
      showToast('Current password is incorrect', 'error')
      setSavingPassword(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('Password changed successfully!', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }

    setSavingPassword(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center grayscale opacity-50">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.3em] font-bold">Loading Settings...</p>
      </div>
    )
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  const sidebarItems = [
    { id: 'profile' as const, label: 'Profile & Email', icon: User },
    { id: 'password' as const, label: 'Change Password', icon: KeyRound },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -40, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[9999]"
          >
            <div
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                toast.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3">
            Account <span className="gold-gradient italic">Settings</span>
          </h1>
          <p className="text-muted-foreground font-light text-lg">
            Manage your profile, security, and account preferences.
          </p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-72 shrink-0"
          >
            <div className="glass rounded-3xl border border-border/50 p-6 sticky top-28 space-y-6">
              {/* User Card */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <User size={28} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-base truncate">
                    {profile?.username || profile?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                </div>
              </div>

              {memberSince && (
                <div className="px-4 py-3 bg-white/5 rounded-xl">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Member Since</p>
                  <p className="text-sm font-medium mt-0.5">{memberSince}</p>
                </div>
              )}

              {/* Nav Items */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeSection === item.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-8"
                >
                  {/* Profile Section */}
                  <div className="glass rounded-3xl border border-border/50 p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <Pencil size={18} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Profile Information</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Update your display name</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Username */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 flex items-center gap-2">
                          <AtSign size={14} className="text-muted-foreground" />
                          Username
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-black/40 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        <p className="text-[11px] text-muted-foreground ml-1">
                          This is your public display name across the platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="glass rounded-3xl border border-border/50 p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                        <Mail size={18} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Email Address</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Change your account email</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1 flex items-center gap-2">
                        <Mail size={14} className="text-muted-foreground" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                      <p className="text-[11px] text-muted-foreground ml-1">
                        Changing your email will require verification via the new address.
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile || (username === (profile?.username || '') && email === profile?.email)}
                      className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                    >
                      {savingProfile ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="glass rounded-3xl border border-border/50 p-8 space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                        <Shield size={18} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Change Password</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Keep your account secure with a strong password
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 flex items-center gap-2">
                          <Lock size={14} className="text-muted-foreground" />
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-black/40 border border-border/50 rounded-xl py-3 px-4 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-border/30" />

                      {/* New Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 flex items-center gap-2">
                          <KeyRound size={14} className="text-muted-foreground" />
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-black/40 border border-border/50 rounded-xl py-3 px-4 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground ml-1">
                          Must be at least 6 characters long.
                        </p>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 flex items-center gap-2">
                          <Lock size={14} className="text-muted-foreground" />
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black/40 border border-border/50 rounded-xl py-3 px-4 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-[11px] text-red-400 ml-1 flex items-center gap-1">
                            <AlertCircle size={12} /> Passwords do not match
                          </p>
                        )}
                        {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
                          <p className="text-[11px] text-green-400 ml-1 flex items-center gap-1">
                            <CheckCircle size={12} /> Passwords match
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Save Password Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleChangePassword}
                        disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                      >
                        {savingPassword ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Shield size={18} />
                        )}
                        {savingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
