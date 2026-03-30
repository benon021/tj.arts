'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero.png" 
          alt="Luxury Art Studio" 
          fill 
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass border border-primary/20 text-primary text-sm font-semibold tracking-widest uppercase mb-6">
            Premium Cinematic Artwork
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 leading-tight">
            Turn Your Life <br />
            <span className="gold-gradient italic">Into a Movie</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
            Custom high-end portraiture inspired by cinematic storytelling. 
            Luxury frames, Netflix-style posters, and museum-quality art for your home.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition-all cinematic-shadow w-full sm:w-auto">
              Create Your Art
            </button>
            <button className="px-10 py-4 glass border border-border/50 rounded-full font-bold text-lg hover:bg-white/5 transition-all w-full sm:w-auto">
              View Gallery
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
         <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  )
}
