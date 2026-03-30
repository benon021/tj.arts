'use client'

import Navbar from "@/components/landing/Navbar"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useOrderStore } from "@/store/useOrderStore"

const templates = [
  {
    id: 'netflix-1',
    title: 'The Legacy',
    category: 'Netflix Style',
    image: '/templates/netflix.png',
    price: 'KES 2,500',
    description: 'A bold, cinematic movie poster style with high-end typography.'
  },
  {
    id: 'luxury-1',
    title: 'Victorian Elegance',
    category: 'Museum Frame',
    image: '/templates/luxury.png',
    price: 'KES 3,500',
    description: 'Classic oil painting style with a luxury museum-quality gold frame.'
  },
  {
    id: 'scifi-1',
    title: 'Neon Vanguard',
    category: 'Sci-Fi Art',
    image: '/templates/scifi.png',
    price: 'KES 3,000',
    description: 'Futuristic tech-noir aesthetic with neon blue and gold accents.'
  }
]

export default function TemplatesPage() {
  const router = useRouter()
  const setTemplate = useOrderStore((state) => state.setTemplate)

  const handleSelect = (id: string) => {
    setTemplate(id)
    router.push('/create')
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            Choose Your <span className="gold-gradient">Masterpiece</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light">
            Select a template to begin your journey. Each style is meticulously designed to transform your photos into high-end cinematic art.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group glass rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 flex flex-col"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image 
                  src={template.image} 
                  alt={template.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8 text-center">
                  <p className="text-sm font-light text-white/80 leading-relaxed italic">
                    &quot;{template.description}&quot;
                  </p>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div>
                     <p className="text-xs text-primary font-bold tracking-widest uppercase mb-1">{template.category}</p>
                     <h3 className="text-2xl font-bold font-serif">{template.title}</h3>
                   </div>
                   <p className="text-xl font-bold gold-gradient">{template.price}</p>
                </div>
                
                <button 
                  onClick={() => handleSelect(template.id)}
                  className="mt-auto w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all transform group-hover:translate-y-[-4px] shadow-lg"
                >
                  Use This Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
