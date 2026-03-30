'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-serif font-bold gold-gradient tracking-tighter">
              TJ.ARTS
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/templates" className="text-sm font-medium hover:text-primary transition-colors">Templates</Link>
            <Link href="/portfolio" className="text-sm font-medium hover:text-primary transition-colors">Portfolio</Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">Art Stories</Link>
            <Link href="/create" className="glass px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/10 transition-all border border-primary/20">
              Create Art
            </Link>
            <div className="flex items-center space-x-4 border-l border-border/50 pl-8">
               <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <User size={20} />
              </Link>
              <Link href="/orders" className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
                <ShoppingBag size={20} />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-b border-border/50 px-4 pt-2 pb-6 space-y-4"
        >
          <Link href="/templates" className="block text-lg font-medium">Templates</Link>
          <Link href="/portfolio" className="block text-lg font-medium">Portfolio</Link>
          <Link href="/blog" className="block text-lg font-medium">Art Stories</Link>
          <Link href="/create" className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-lg font-bold">
            Create Art
          </Link>
        </motion.div>
      )}
    </nav>
  )
}
