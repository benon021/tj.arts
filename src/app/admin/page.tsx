'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  LayoutDashboard, ShoppingBag, Palette, Users, FileText, Settings, 
  CheckCircle, Clock, MoreVertical, ArrowRight, Loader2, AlertTriangle, 
  Plus, X, Trash2, Edit2, ExternalLink, Mail, ShieldCheck, UserCheck 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminDashboard() {
   const [activeTab, setActiveTab] = useState('dashboard')
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   
   // Data states
   const [orders, setOrders] = useState<any[]>([])
   const [templates, setTemplates] = useState<any[]>([])
   const [customers, setCustomers] = useState<any[]>([])
   const [stats, setStats] = useState({
      total: 0,
      pending: 0,
      in_progress: 0,
      completed: 0
   })

   // UI states
   const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false)
   const [newTemplate, setNewTemplate] = useState({ name: '', description: '', price: 3500, category: 'Cinematic', imageUrl: '' })
   const [savingTemplate, setSavingTemplate] = useState(false)

   useEffect(() => {
      fetchDashboardData()
   }, [])

   const fetchDashboardData = async () => {
      setLoading(true)
      try {
         const { data: { session } } = await supabase.auth.getSession()
         if (!session) return

         // Fetch Orders
         const ordersRes = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${session.access_token}` } })
         const ordersData = await ordersRes.json()
         if (ordersData.error) throw new Error(ordersData.error)
         setOrders(ordersData.orders || [])
         setStats(ordersData.stats)

         // Fetch Templates
         const templatesRes = await fetch('/api/admin/templates', { headers: { 'Authorization': `Bearer ${session.access_token}` } })
         const templatesData = await templatesRes.json()
         setTemplates(templatesData || [])

         // Fetch Customers
         const customersRes = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${session.access_token}` } })
         const customersData = await customersRes.json()
         setCustomers(customersData || [])

      } catch (err: any) {
         setError(err.message || 'Failed to fetch admin data')
      } finally {
         setLoading(false)
      }
   }

   const handleUpdateStatus = async (orderId: string, newStatus: string) => {
      try {
         const { data: { session } } = await supabase.auth.getSession()
         const res = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
            body: JSON.stringify({ status: newStatus })
         })
         if (res.ok) fetchDashboardData()
      } catch (err) {
         console.error('Failed to update status', err)
      }
   }

   const handleAddTemplate = async (e: React.FormEvent) => {
      e.preventDefault()
      setSavingTemplate(true)
      try {
         const { data: { session } } = await supabase.auth.getSession()
         const res = await fetch('/api/admin/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
            body: JSON.stringify(newTemplate)
         })
         if (res.ok) {
            setIsAddTemplateOpen(false)
            setNewTemplate({ name: '', description: '', price: 3500, category: 'Cinematic', imageUrl: '' })
            fetchDashboardData()
         }
      } catch (err) {
         console.error('Failed to add template', err)
      } finally {
         setSavingTemplate(false)
      }
   }

   const handleDeleteTemplate = async (id: string) => {
      if (!confirm('Are you sure you want to delete this template?')) return
      try {
         const { data: { session } } = await supabase.auth.getSession()
         const res = await fetch(`/api/admin/templates?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session?.access_token}` }
         })
         if (res.ok) fetchDashboardData()
      } catch (err) {
         console.error('Failed to delete template', err)
      }
   }

   const statCards = [
      { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'text-blue-400' },
      { label: 'Pending Payment', value: stats.pending, icon: Clock, color: 'text-amber-400' },
      { label: 'In Progress', value: stats.in_progress, icon: Palette, color: 'text-primary' },
      { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400' }
   ]

   return (
      <main className="min-h-screen bg-background pt-24">
         {/* Sidebar Simulation */}
         <div className="flex h-[calc(100vh-6rem)]">
            <aside className="w-64 border-r border-border/50 p-6 hidden md:flex flex-col gap-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-2">Main Menu</p>
                  {[
                     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                     { id: 'orders', label: 'Manage Orders', icon: ShoppingBag },
                     { id: 'templates', label: 'Templates', icon: Palette },
                     { id: 'customers', label: 'Customers', icon: Users },
                     { id: 'blog', label: 'Blog Posts', icon: FileText },
                  ].map((item) => (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'
                           }`}
                     >
                        <item.icon size={18} />
                        <span className="text-sm font-medium">{item.label}</span>
                     </button>
                  ))}
               </div>

               <div className="mt-auto pt-8 border-t border-border/50">
                  <Link href="/settings" className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-all">
                     <Settings size={18} />
                     <span className="text-sm font-medium">Settings</span>
                  </Link>
               </div>
            </aside>

            <section className="flex-1 overflow-y-auto p-8 relative">
               {/* Modals */}
               <AnimatePresence>
                  {isAddTemplateOpen && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                           initial={{ opacity: 0 }} 
                           animate={{ opacity: 1 }} 
                           exit={{ opacity: 0 }}
                           onClick={() => setIsAddTemplateOpen(false)}
                           className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                        />
                        <motion.div 
                           initial={{ scale: 0.9, opacity: 0, y: 20 }}
                           animate={{ scale: 1, opacity: 1, y: 0 }}
                           exit={{ scale: 0.9, opacity: 0, y: 20 }}
                           className="relative w-full max-w-xl glass border border-border/50 rounded-3xl p-8 overflow-hidden"
                        >
                           <h2 className="text-2xl font-serif font-bold mb-6">Add New <span className="gold-gradient italic">Template</span></h2>
                           <form onSubmit={handleAddTemplate} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Template Name</label>
                                    <input 
                                       required
                                       value={newTemplate.name}
                                       onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                                       className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                                       placeholder="Cinematic Gold"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Price (KES)</label>
                                    <input 
                                       type="number"
                                       required
                                       value={newTemplate.price}
                                       onChange={e => setNewTemplate({...newTemplate, price: parseInt(e.target.value)})}
                                       className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Category</label>
                                 <select 
                                    value={newTemplate.category}
                                    onChange={e => setNewTemplate({...newTemplate, category: e.target.value})}
                                    className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                                 >
                                    <option value="Cinematic">Cinematic</option>
                                    <option value="Portrait">Portrait</option>
                                    <option value="Abstract">Abstract</option>
                                    <option value="Commercial">Commercial</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Image URL</label>
                                 <input 
                                    value={newTemplate.imageUrl}
                                    onChange={e => setNewTemplate({...newTemplate, imageUrl: e.target.value})}
                                    className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm"
                                    placeholder="https://..."
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Description</label>
                                 <textarea 
                                    rows={3}
                                    value={newTemplate.description}
                                    onChange={e => setNewTemplate({...newTemplate, description: e.target.value})}
                                    className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-sm resize-none"
                                 />
                              </div>
                              <div className="flex gap-4 pt-4">
                                 <button type="button" onClick={() => setIsAddTemplateOpen(false)} className="flex-1 py-3 px-6 glass rounded-xl text-sm font-bold">Cancel</button>
                                 <button type="submit" disabled={savingTemplate} className="flex-2 py-3 px-8 bg-primary text-primary-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                                    {savingTemplate && <Loader2 size={16} className="animate-spin" />}
                                    Create Template
                                 </button>
                              </div>
                           </form>
                        </motion.div>
                     </div>
                  )}
               </AnimatePresence>

               <div className="max-w-6xl mx-auto space-y-12">
                  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                     <div>
                        <h1 className="text-3xl font-serif font-bold">Artist <span className="gold-gradient">Control Center</span></h1>
                        <p className="text-muted-foreground font-light mt-1">
                           {activeTab === 'dashboard' ? 'Manage your art boutique and client orders.' : 
                            activeTab === 'templates' ? 'Manage your cinematic art templates.' :
                            activeTab === 'customers' ? 'View and manage your artist network.' :
                            'Manage your stories and artistic updates.'}
                        </p>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => fetchDashboardData()} className="p-2 glass border border-border rounded-lg hover:text-primary transition-colors">
                           <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={() => setIsAddTemplateOpen(true)} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold flex items-center gap-2">
                           <Plus size={18} />
                           Add New Template
                        </button>
                     </div>
                  </header>

                  {error && (
                     <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                        <AlertTriangle size={18} />
                        {error}
                     </div>
                  )}

                  <AnimatePresence mode="wait">
                     {activeTab === 'dashboard' && (
                        <motion.div 
                           key="dashboard"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="space-y-12"
                        >
                           {/* Stats Grid */}
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              {statCards.map((stat, i) => (
                                 <div key={i} className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group hover:border-primary/30 transition-all">
                                    <div className="relative z-10 flex justify-between items-start">
                                       <div>
                                          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                                          <h3 className="text-3xl font-bold font-mono">
                                             {loading ? <Loader2 className="animate-spin text-muted-foreground" size={24} /> : stat.value}
                                          </h3>
                                       </div>
                                       <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                          <stat.icon size={20} />
                                       </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                       <stat.icon size={80} strokeWidth={1} />
                                    </div>
                                 </div>
                              ))}
                           </div>

                           {/* Recent Orders Overview */}
                           <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                 <h2 className="text-xl font-bold font-serif">Recent <span className="gold-gradient italic">Orders</span></h2>
                                 <button onClick={() => setActiveTab('orders')} className="text-xs text-primary font-bold hover:underline">View All Orders</button>
                              </div>

                              <div className="glass rounded-2xl border border-border/50 overflow-hidden min-h-[120px]">
                                 {orders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-20 text-center">
                                       <ShoppingBag className="text-muted-foreground/20 mb-4" size={48} />
                                       <p className="text-muted-foreground font-light">No orders placed yet.</p>
                                    </div>
                                 ) : (
                                    <table className="w-full text-left">
                                       <thead className="bg-white/5 border-b border-border/50">
                                          <tr>
                                             <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Order ID</th>
                                             <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Status</th>
                                             <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Updates</th>
                                             <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Price</th>
                                             <th className="px-6 py-4"></th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-border/50 text-sm">
                                          {orders.slice(0, 5).map((order) => (
                                             <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                   <div className="flex flex-col">
                                                      <span className="font-bold text-[10px] mono">ORD-{order.id.split('-')[0]}</span>
                                                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">{order.title}</span>
                                                   </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                   <div className="flex items-center gap-2">
                                                      <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'completed' ? 'bg-green-400' : order.status === 'in_progress' ? 'bg-primary' : 'bg-amber-400'}`} />
                                                      <span className="capitalize text-xs">{order.status.replace('_', ' ')}</span>
                                                   </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                   <select 
                                                      value={order.status}
                                                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                      className="bg-white/5 border border-border/50 rounded-lg px-2 py-1 text-[10px] font-bold outline-none border-primary/20"
                                                   >
                                                      <option value="pending">Mark Pending</option>
                                                      <option value="in_progress">Start Order</option>
                                                      <option value="completed">Complete Art</option>
                                                   </select>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-xs">KES {(order.price || 3500).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                   <MoreVertical size={14} className="text-muted-foreground" />
                                                </td>
                                             </tr>
                                          ))}
                                       </tbody>
                                    </table>
                                 )}
                              </div>
                           </div>

                           {/* Quick Actions Card Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div 
                                 onClick={() => setActiveTab('templates')}
                                 className="glass p-8 rounded-3xl border border-border/50 flex items-center gap-6 cursor-pointer hover:border-primary/40 group transition-all"
                              >
                                 <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Palette size={32} />
                                 </div>
                                 <div className="flex-1">
                                    <h3 className="text-lg font-bold">Template Workshop</h3>
                                    <p className="text-sm text-muted-foreground font-light">Add or edit your cinematic art templates.</p>
                                 </div>
                                 <div className="p-3 bg-white/5 border border-border rounded-xl group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                                    <ArrowRight size={20} />
                                 </div>
                              </div>
                              <div 
                                 onClick={() => setActiveTab('blog')}
                                 className="glass p-8 rounded-3xl border border-border/50 flex items-center gap-6 cursor-pointer hover:border-blue-400/40 group transition-all"
                              >
                                 <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <FileText size={32} />
                                 </div>
                                 <div className="flex-1">
                                    <h3 className="text-lg font-bold">Blog & Stories</h3>
                                    <p className="text-sm text-muted-foreground font-light">Write about your artistic journey and updates.</p>
                                 </div>
                                 <div className="p-3 bg-white/5 border border-border rounded-xl group-hover:bg-blue-400/20 group-hover:border-blue-400/40 transition-all">
                                    <ArrowRight size={20} />
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'templates' && (
                        <motion.div 
                           key="templates"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="space-y-8"
                        >
                           <div className="flex items-center justify-between">
                              <h2 className="text-xl font-bold">Template <span className="gold-gradient italic">Workshop</span></h2>
                              <button onClick={() => setIsAddTemplateOpen(true)} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all">
                                 + New Template
                              </button>
                           </div>

                           {templates.length === 0 ? (
                              <div className="glass p-20 rounded-3xl border border-border/50 flex flex-col items-center justify-center text-center space-y-4">
                                 <Palette className="text-muted-foreground/20" size={64} />
                                 <h3 className="text-lg font-bold">No Templates Yet</h3>
                                 <p className="text-sm text-muted-foreground max-w-xs">Start building your gallery of cinematic art templates.</p>
                                 <button onClick={() => setIsAddTemplateOpen(true)} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold">Create First Template</button>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {templates.map((template) => (
                                    <div key={template.id} className="glass rounded-3xl border border-border/50 overflow-hidden group hover:border-primary/30 transition-all">
                                       <div className="aspect-video bg-black/40 relative">
                                          {template.image_url ? (
                                             <img src={template.image_url} alt={template.name} className="w-full h-full object-cover" />
                                          ) : (
                                             <div className="flex items-center justify-center h-full text-muted-foreground/20 italic text-xs">No Image Preview</div>
                                          )}
                                          <div className="absolute top-4 right-4 flex gap-2 pt-2">
                                             <button onClick={() => handleDeleteTemplate(template.id)} className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 size={14} />
                                             </button>
                                          </div>
                                       </div>
                                       <div className="p-6">
                                          <div className="flex justify-between items-start mb-2">
                                             <h4 className="font-bold">{template.name}</h4>
                                             <span className="text-xs font-mono font-bold gold-gradient">KES {template.price.toLocaleString()}</span>
                                          </div>
                                          <p className="text-xs text-muted-foreground font-light line-clamp-2">{template.description}</p>
                                          <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center">
                                             <span className="text-[10px] uppercase font-bold text-muted-foreground">{template.category || 'Cinematic'}</span>
                                             <button className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline">
                                                Edit Details <Edit2 size={10} />
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </motion.div>
                     )}

                     {activeTab === 'customers' && (
                        <motion.div 
                           key="customers"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="space-y-6"
                        >
                           <h2 className="text-xl font-bold font-serif">Artist <span className="gold-gradient italic">Network</span></h2>
                           <div className="glass rounded-2xl border border-border/50 overflow-hidden">
                              <table className="w-full text-left">
                                 <thead className="bg-white/5 border-b border-border/50">
                                    <tr>
                                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">User</th>
                                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Email</th>
                                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Role</th>
                                       <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Status</th>
                                       <th className="px-6 py-4"></th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-border/50 text-sm">
                                    {customers.length === 0 ? (
                                       <tr><td colSpan={5} className="px-6 py-20 text-center text-muted-foreground font-light">No customers found in your network.</td></tr>
                                    ) : customers.map((user: any) => (
                                       <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                          <td className="px-6 py-4">
                                             <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                                                   {user.profile?.username?.[0] || user.email?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="font-bold">{user.profile?.username || 'Unnamed Artist'}</span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4 text-muted-foreground text-xs">{user.email}</td>
                                          <td className="px-6 py-4">
                                             {user.profile?.is_admin ? (
                                                <span className="flex items-center gap-1.5 text-xs text-primary font-bold">
                                                   <ShieldCheck size={14} /> Admin
                                                </span>
                                             ) : (
                                                <span className="flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                                                   <UserCheck size={14} /> Creator
                                                </span>
                                             )}
                                          </td>
                                          <td className="px-6 py-4">
                                             <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full font-bold">Active</span>
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                             <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground">
                                                <ExternalLink size={14} />
                                             </button>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'blog' && (
                         <motion.div 
                           key="blog"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="glass p-20 rounded-3xl border border-border/50 flex flex-col items-center justify-center text-center space-y-4"
                        >
                           <FileText className="text-muted-foreground/20" size={64} />
                           <h3 className="text-lg font-bold">Stories & Updates</h3>
                           <p className="text-sm text-muted-foreground max-w-xs">The storytelling engine is currently being fueled. Soon you will be able to share your artistic journey.</p>
                           <button className="px-8 py-3 bg-white/5 border border-border rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">Coming Soon</button>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </section>
         </div>
      </main>
   )
}
