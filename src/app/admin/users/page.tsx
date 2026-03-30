'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/landing/Navbar'
import { motion } from 'framer-motion'
import { Users, Mail, Lock, Shield, Edit2, Loader2, Search, X, CheckCircle } from 'lucide-react'

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          email: newEmail !== editingUser.email ? newEmail : undefined,
          password: newPassword || undefined,
          isAdmin: isAdmin
        })
      })
      
      const data = await res.json()
      if (data.success) {
        alert('User updated successfully!')
        setEditingUser(null)
        fetchUsers()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.id.includes(search)
  )

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4">
        <header className="flex justify-between items-end mb-12">
           <div>
              <h1 className="text-4xl font-serif font-bold italic">User <span className="gold-gradient">Management</span></h1>
              <p className="text-muted-foreground font-light mt-1">Manage client accounts, credentials, and permissions.</p>
           </div>
           
           <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type="text" 
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none"
              />
           </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
             <Loader2 className="animate-spin mb-4" size={48} />
             <p className="text-sm uppercase tracking-widest font-bold">Synchronizing Vault...</p>
          </div>
        ) : (
          <div className="glass rounded-3xl border border-border/50 overflow-hidden shadow-2xl">
             <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-border/50">
                   <tr>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">User Identity</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Email Address</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Role</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Joined</th>
                      <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                   {filteredUsers.map((user) => (
                     <tr key={user.id} className="hover:bg-white/5 transition-all text-sm group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                 {user.email?.[0].toUpperCase()}
                              </div>
                              <div className="font-mono text-[10px] text-muted-foreground">
                                 {user.id}
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 font-medium">{user.email}</td>
                        <td className="px-8 py-6">
                           {user.profile?.is_admin ? (
                             <span className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-widest">
                                <Shield size={12} /> Artist / Admin
                             </span>
                           ) : (
                             <span className="text-muted-foreground text-xs uppercase tracking-widest">Client</span>
                           )}
                        </td>
                        <td className="px-8 py-6 text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="px-8 py-6 text-right">
                           <button 
                             onClick={() => {
                               setEditingUser(user)
                               setNewEmail(user.email)
                               setIsAdmin(user.profile?.is_admin || false)
                             }}
                             className="p-3 bg-white/5 border border-border rounded-xl opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:border-primary/50 transition-all"
                           >
                              <Edit2 size={16} />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
           <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md glass p-10 rounded-3xl border border-primary/20 shadow-2xl"
           >
              <button 
                onClick={() => setEditingUser(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-10">
                 <h3 className="text-2xl font-serif font-bold italic mb-2">Modify <span className="gold-gradient">Credentials</span></h3>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{editingUser.id}</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                       <input 
                        type="email" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-black/40 border border-border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">New Password (Optional)</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                       <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                       />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic ml-1">Leave blank to keep current password.</p>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-border">
                    <div className="flex flex-col">
                       <p className="text-sm font-bold">Grant Admin Privileges</p>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Artist Status</p>
                    </div>
                    <button 
                      onClick={() => setIsAdmin(!isAdmin)}
                      className={`w-12 h-6 rounded-full transition-all relative ${isAdmin ? 'bg-primary' : 'bg-white/10'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isAdmin ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>

                 <button 
                  disabled={updating}
                  onClick={handleUpdate}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 shadow-xl disabled:opacity-50"
                 >
                    {updating ? <Loader2 className="animate-spin" size={20} /> : (
                      <><CheckCircle size={18} /> Save Changes</>
                    )}
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </main>
  )
}
