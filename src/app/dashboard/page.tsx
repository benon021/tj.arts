'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/landing/Navbar'
import { motion } from 'framer-motion'
import { 
  Palette, 
  ShoppingBag, 
  Clock, 
  Plus, 
  Sparkles, 
  Settings, 
  LogOut,
  ChevronRight,
  User,
  LayoutDashboard,
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

export default function DashboardPage() {
  const [user, setUser] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0
  })
  const router = useRouter()

  useEffect(() => {
    async function getDashboardData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        setLoading(false)
        return
      }

      try {
        // Fetch profile
        const profileRes = await fetch('/api/account', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (profileRes.ok) {
          const profileData: ProfileData = await profileRes.json()
          setUser(profileData)
        }

        // Fetch orders and stats
        const ordersRes = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          setOrders(ordersData.orders || [])
          setStats(ordersData.stats)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      }
      setLoading(false)
    }
    getDashboardData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const displayName = user?.username || user?.email?.split('@')[0] || 'Artist'

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center grayscale opacity-50">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.3em] font-bold">Synchronizing Studio...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              Welcome, <span className="gold-gradient italic">{displayName}</span>
            </h1>
            <p className="text-muted-foreground font-light text-lg">
              Manage your cinematic art collections and studio profile.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <Link 
              href="/create"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              New Artwork
            </Link>
            <button 
              onClick={handleLogout}
              className="p-4 glass border border-border/50 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 transition-all text-muted-foreground hover:text-red-400"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </motion.div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Total Artworks', value: stats.total, icon: Palette, color: 'text-primary' },
            { label: 'Active Orders', value: stats.pending + stats.in_progress, icon: Clock, color: 'text-blue-400' },
            { label: 'Completed', value: stats.completed, icon: ShoppingBag, color: 'text-purple-400' },
            { label: 'Studio Sparks', value: '120', icon: Sparkles, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl border border-border/50 relative overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="relative z-10 flex flex-col gap-4">
                <div className={`p-3 rounded-xl bg-white/5 w-fit ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold font-mono tracking-tighter">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">{stat.label}</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
                <stat.icon size={100} strokeWidth={1} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Collection Display */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold italic">Recent <span className="gold-gradient">Masterpieces</span></h2>
              <Link href="/orders" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {/* Artwork List or Empty State */}
            {orders.length === 0 ? (
              <div className="glass p-12 rounded-[2rem] border border-border/50 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-32 bg-white/5 border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground/30">
                  <Palette size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">No Artworks Found</h3>
                  <p className="text-muted-foreground font-light max-w-sm mx-auto">
                    You haven&apos;t commissioned any cinematic masterpieces yet. Let&apos;s start your first artistic journey!
                  </p>
                </div>
                <Link 
                  href="/create"
                  className="px-8 py-3 bg-white/5 border border-border rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Create First Art
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {orders.slice(0, 4).map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-3xl border border-border/50 overflow-hidden group hover:border-primary/30 transition-all"
                  >
                    <div className="aspect-[4/5] bg-black/40 relative">
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Palette size={48} className="text-muted-foreground/20" />
                       </div>
                       <div className="absolute top-4 left-4">
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10 backdrop-blur-md ${
                            order.status === 'completed' ? 'text-green-400 bg-green-400/10' : 
                            order.status === 'in_progress' ? 'text-primary bg-primary/10' : 'text-amber-400 bg-amber-400/10'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                       </div>
                    </div>
                    <div className="p-6">
                       <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-1">{order.template_id}</p>
                       <h4 className="text-lg font-bold truncate">{order.title}</h4>
                       <p className="text-xs text-muted-foreground mt-1">Ordered on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-serif font-bold italic group">Studio <span className="gold-gradient">Profile</span></h2>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-border/50 space-y-8 sticky top-32 shadow-2xl">
              <div className="flex flex-col items-center gap-4 text-center">
                <Link
                  href="/settings"
                  className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative group cursor-pointer overflow-hidden"
                >
                  <User size={48} className="group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Pencil size={24} className="text-white" />
                  </div>
                </Link>
                <div>
                   <p className="font-bold text-lg">{displayName}</p>
                   <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{user?.email}</p>
                   <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">Standard Collector</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/50">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Quick Links</p>
                {[
                  { label: 'Account Settings', icon: Settings, href: '/settings' },
                  { label: 'Payment Methods', icon: LayoutDashboard, href: '/payment' },
                  { label: 'Saved Templates', icon: Palette, href: '/templates' },
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    href={item.href}
                    className="flex items-center justify-between p-4 bg-white/5 border border-transparent rounded-2xl hover:border-primary/20 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </Link>
                ))}
              </div>

              <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] text-center space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Membership Status</p>
                <p className="text-sm font-serif font-bold italic">Premium Artist Tier</p>
                <button className="text-xs text-primary font-bold hover:underline mt-2">Upgrade Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
