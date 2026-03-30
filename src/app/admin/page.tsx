'use client'

import { useState } from 'react'
import Navbar from '@/components/landing/Navbar'
import { motion } from 'framer-motion'
import { LayoutDashboard, ShoppingBag, Palette, Users, FileText, Settings, CheckCircle, Clock, AlertCircle, TrendingUp, MoreVertical } from 'lucide-react'
import Image from 'next/image'

const stats = [
  { label: 'Total Orders', value: '124', icon: ShoppingBag, color: 'text-blue-400' },
  { label: 'Pending Payment', value: '12', icon: Clock, color: 'text-amber-400' },
  { label: 'In Progress', value: '45', icon: Palette, color: 'text-primary' },
  { label: 'Completed', value: '67', icon: CheckCircle, color: 'text-green-400' }
]

const recentOrders = [
  { id: 'ORD-001', user: 'James Kamau', template: 'The Legacy', status: 'pending', date: '2 hours ago', price: 'KES 2,500' },
  { id: 'ORD-002', user: 'Sarah Doe', template: 'Victorian Elegance', status: 'in_progress', date: '5 hours ago', price: 'KES 3,500' },
  { id: 'ORD-003', user: 'Mike Ross', template: 'Neon Vanguard', status: 'completed', date: '1 day ago', price: 'KES 3,000' }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders')

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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
           </div>
           
           <div className="mt-auto pt-8 border-t border-border/50">
             <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-all">
                <Settings size={18} />
                <span className="text-sm font-medium">Settings</span>
             </button>
           </div>
        </aside>

        <section className="flex-1 overflow-y-auto p-8">
           <div className="max-w-6xl mx-auto space-y-12">
              <header className="flex justify-between items-end">
                <div>
                   <h1 className="text-3xl font-serif font-bold">Artist <span className="gold-gradient">Control Center</span></h1>
                   <p className="text-muted-foreground font-light mt-1">Manage your art boutique and client orders.</p>
                </div>
                <div className="flex gap-4">
                   <button className="px-6 py-2 glass border border-border rounded-lg text-sm font-bold">Export Data</button>
                   <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">Add New Template</button>
                </div>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group hover:border-primary/30 transition-all">
                     <div className="relative z-10 flex justify-between items-start">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                          <h3 className="text-3xl font-bold">{stat.value}</h3>
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

              {/* Content Tables */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold font-serif">Recent <span className="gold-gradient italic">Orders</span></h2>
                   <button className="text-xs text-primary font-bold hover:underline">View All Orders</button>
                </div>
                
                <div className="glass rounded-2xl border border-border/50 overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-white/5 border-b border-border/50">
                         <tr>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Order ID</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Customer</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Art Template</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Status</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Date</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Price</th>
                            <th className="px-6 py-4"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-sm">
                         {recentOrders.map((order) => (
                           <tr key={order.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-bold">{order.id}</td>
                              <td className="px-6 py-4 text-muted-foreground">{order.user}</td>
                              <td className="px-6 py-4">
                                 <span className="glass px-2 py-1 rounded text-[10px] uppercase border border-primary/20">{order.template}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                      order.status === 'completed' ? 'bg-green-400' : order.status === 'in_progress' ? 'bg-primary' : 'bg-amber-400'
                                    }`} />
                                    <span className="capitalize">{order.status.replace('_', ' ')}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                              <td className="px-6 py-4 font-bold">{order.price}</td>
                              <td className="px-6 py-4 text-right">
                                 <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <MoreVertical size={16} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass p-8 rounded-3xl border border-border/50 flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                       <Palette size={32} />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold">Template Workshop</h3>
                       <p className="text-sm text-muted-foreground font-light">Add or edit your cinematic art templates.</p>
                    </div>
                    <button className="ml-auto p-3 bg-white/5 border border-border rounded-xl hover:bg-primary/20 hover:border-primary/40 transition-all">
                       <ArrowRight size={20} />
                    </button>
                 </div>
                 <div className="glass p-8 rounded-3xl border border-border/50 flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                       <FileText size={32} />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold">Blog & Stories</h3>
                       <p className="text-sm text-muted-foreground font-light">Write about your artistic journey and updates.</p>
                    </div>
                    <button className="ml-auto p-3 bg-white/5 border border-border rounded-xl hover:bg-blue-400/20 hover:border-blue-400/40 transition-all">
                       <ArrowRight size={20} />
                    </button>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}
