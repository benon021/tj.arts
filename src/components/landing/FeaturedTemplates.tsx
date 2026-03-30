'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const templates = [
  {
    id: 'netflix-1',
    title: 'The Legacy',
    category: 'Netflix Style',
    image: '/templates/netflix.png',
    price: 'KES 2,500'
  },
  {
    id: 'luxury-1',
    title: 'Victorian Elegance',
    category: 'Museum Frame',
    image: '/templates/luxury.png',
    price: 'KES 3,500'
  },
  {
    id: 'scifi-1',
    title: 'Neon Vanguard',
    category: 'Sci-Fi Art',
    image: '/templates/scifi.png',
    price: 'KES 3,000'
  }
]

export default function FeaturedTemplates() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Featured <span className="gold-gradient">Templates</span></h2>
            <p className="text-muted-foreground font-light max-w-lg">Choose a cinematic style that matches your story. Each design is handcrafted to perfection.</p>
          </div>
          <Link href="/templates" className="hidden md:block text-primary hover:underline underline-offset-4 font-semibold">
            View All Templates →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image 
                  src={template.image} 
                  alt={template.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                   <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     Use This Style
                   </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-primary font-bold tracking-widest uppercase mb-1">{template.category}</p>
                    <h3 className="text-xl font-bold font-serif">{template.title}</h3>
                  </div>
                  <p className="text-lg font-bold gold-gradient">{template.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 md:hidden">
           <Link href="/templates" className="block w-full text-center py-4 glass border border-primary/20 text-primary font-bold rounded-xl">
             View All Templates
           </Link>
        </div>
      </div>
    </section>
  )
}
