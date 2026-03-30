'use client'

import Navbar from "@/components/landing/Navbar"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

const posts = [
  {
    title: "The Art of Cinematic Portraiture",
    excerpt: "Discover the techniques behind our movie-inspired digital paintings and how we capture emotion.",
    date: "March 25, 2024",
    author: "TJ.Arts Artist",
    image: "/templates/netflix.png",
    slug: "cinematic-portraiture-art"
  },
  {
    title: "Why Luxury Frames Matter",
    excerpt: "How a museum-quality frame can transform a simple digital artwork into a timeless masterpiece.",
    date: "March 20, 2024",
    author: "TJ.Arts Artist",
    image: "/templates/luxury.png",
    slug: "luxury-frames-impact"
  },
  {
    title: "From Sci-Fi to Reality",
    excerpt: "Exploring the futurism trends in digital art and how we incorporate neon aesthetics into portraits.",
    date: "March 15, 2024",
    author: "TJ.Arts Artist",
    image: "/templates/scifi.png",
    slug: "scifi-art-trends"
  }
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20">
           <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif font-bold mb-6"
           >
             Art <span className="gold-gradient">Stories</span>
           </motion.h1>
           <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg">
             Inside the studio: Exploring the intersection of photography, cinema, and digital art.
           </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {posts.map((post, index) => (
             <motion.article 
               key={index}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               viewport={{ once: true }}
               className="group cursor-pointer"
             >
               <Link href={`/blog/${post.slug}`}>
                 <div className="relative aspect-video rounded-3xl overflow-hidden border border-border/50 mb-6">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-primary">
                       <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                       <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors leading-tight">{post.title}</h2>
                    <p className="text-muted-foreground font-light text-sm line-clamp-3 leading-relaxed">
                       {post.excerpt}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                       Read Story <ArrowRight size={14} />
                    </div>
                 </div>
               </Link>
             </motion.article>
           ))}
        </div>
      </div>
    </main>
  )
}
