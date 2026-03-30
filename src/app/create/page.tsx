'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/landing/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Check, ArrowRight, ArrowLeft, Image as ImageIcon, Type, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useOrderStore } from '@/store/useOrderStore'
import { useRouter } from 'next/navigation'

const templates = [
  { id: 'netflix-1', title: 'The Legacy', image: '/templates/netflix.png' },
  { id: 'luxury-1', title: 'Victorian Elegance', image: '/templates/luxury.png' },
  { id: 'scifi-1', title: 'Neon Vanguard', image: '/templates/scifi.png' }
]

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const { templateId, setTemplate, imageUrls, setImages, titleText, subtitleText, setText } = useOrderStore()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    if (imageUrls.length > 0 && previews.length === 0) {
      setPreviews(imageUrls)
    }
  }, [imageUrls])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3)
      setFiles(selectedFiles)
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
      setPreviews(newPreviews)
      setImages(newPreviews) // In real app, we upload to Supabase and get URLs
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const selectedTemplate = templates.find(t => t.id === templateId)

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-500 ${
                step >= s ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground'
              }`}
            >
              {step > s ? <Check size={18} /> : s}
            </div>
          ))}
        </div>

        <div className="glass border border-border/50 rounded-3xl p-8 md:p-12 min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-serif font-bold mb-4">Upload Your <span className="gold-gradient">Photos</span></h2>
                  <p className="text-muted-foreground font-light">Choose up to 3 high-quality photos for your artwork.</p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  {previews.map((url, i) => (
                    <div key={i} className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/20">
                      <Image src={url} alt="preview" fill className="object-cover" />
                      <button 
                        onClick={() => {
                          const newPreviews = previews.filter((_, index) => index !== i)
                          setPreviews(newPreviews)
                          setImages(newPreviews)
                        }}
                        className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {previews.length < 3 && (
                    <label className="w-32 h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
                      <Upload className="text-muted-foreground group-hover:text-primary transition-colors" size={24} />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Add Photo</span>
                      <input type="file" className="hidden" onChange={handleFileChange} multiple accept="image/*" />
                    </label>
                  )}
                </div>

                <div className="pt-8 flex justify-end">
                  <button 
                    disabled={previews.length === 0}
                    onClick={nextStep}
                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    Next Step <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-serif font-bold mb-4">Select <span className="gold-gradient">Template</span></h2>
                  <p className="text-muted-foreground font-light">Select the design style you want to apply.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {templates.map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                        templateId === t.id ? 'border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10' : 'border-border grayscale hover:grayscale-0'
                      }`}
                    >
                      <Image src={t.image} alt={t.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                        <p className="text-xs font-bold text-white uppercase tracking-widest">{t.title}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-8 flex justify-between">
                  <button onClick={prevStep} className="px-8 py-3 glass border border-border rounded-xl font-bold flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button 
                    disabled={!templateId}
                    onClick={nextStep}
                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    Next Step <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-serif font-bold mb-4">Custom <span className="gold-gradient">Details</span></h2>
                  <p className="text-muted-foreground font-light">Add title and text to be featured in your artwork.</p>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                    <div className="space-y-2">
                       <label className="text-sm font-bold uppercase tracking-widest text-primary">Main Title</label>
                       <input 
                        type="text" 
                        value={titleText}
                        onChange={(e) => setText(e.target.value, subtitleText)}
                        placeholder="e.g. THE LEGACY"
                        className="w-full bg-black/40 border border-border rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-serif text-lg"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold uppercase tracking-widest text-primary">Subtitle / Tagline</label>
                       <textarea 
                        value={subtitleText}
                        onChange={(e) => setText(titleText, e.target.value)}
                        placeholder="e.g. Every story has a beginning."
                        className="w-full bg-black/40 border border-border rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32 resize-none"
                       />
                    </div>
                </div>

                <div className="pt-8 flex justify-between">
                  <button onClick={prevStep} className="px-8 py-3 glass border border-border rounded-xl font-bold flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button 
                    disabled={!titleText}
                    onClick={nextStep}
                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    Next Step <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-serif font-bold mb-4">Final <span className="gold-gradient">Preview</span></h2>
                  <p className="text-muted-foreground font-light">Confirm your art details before placing the order.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center">
                  {/* Mock Artwork Preview */}
                  <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl cinematic-shadow border-4 border-white/5">
                    {selectedTemplate && (
                      <Image src={selectedTemplate.image} alt="template" fill className="object-cover opacity-90" />
                    )}
                    
                    {/* User Photo Placeholder Overlay (Simulation) */}
                    <div className="absolute inset-x-8 top-16 bottom-32 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                       {previews[0] ? (
                         <Image src={previews[0]} alt="user photo" fill className="object-cover opacity-50" />
                       ) : (
                         <ImageIcon className="text-white/20" size={48} />
                       )}
                    </div>

                    {/* Watermark Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rotate-[-30deg] pointer-events-none opacity-20">
                      <p className="text-5xl font-black text-white tracking-[1rem] border-y-4 border-white py-4">PREVIEW ONLY</p>
                    </div>

                    {/* Text Overlay */}
                    <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                       <h3 className="text-2xl font-serif font-bold gold-gradient uppercase tracking-widest">{titleText}</h3>
                       <p className="text-[10px] text-white/60 font-light mt-1 uppercase tracking-[0.2em]">{subtitleText}</p>
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="flex-1 w-full space-y-6">
                    <div className="glass p-6 rounded-2xl border border-border/50 space-y-4">
                       <div className="flex justify-between items-center pb-4 border-b border-border/50">
                          <span className="text-muted-foreground">Style</span>
                          <span className="font-bold">{selectedTemplate?.title}</span>
                       </div>
                       <div className="flex justify-between items-center pb-4 border-b border-border/50">
                          <span className="text-muted-foreground">Photos</span>
                          <span className="font-bold">{previews.length} Uploaded</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Total Price</span>
                          <span className="text-xl font-bold gold-gradient uppercase">KES 3,500</span>
                       </div>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                       <p className="text-sm font-light text-primary flex gap-2 items-start">
                         <Sparkles size={16} className="shrink-0 mt-0.5" />
                         Your artwork will be hand-refined by the artist using premium tools. A 50% deposit is required to begin.
                       </p>
                    </div>

                    <div className="pt-4 flex flex-col gap-4">
                      <button 
                        onClick={() => router.push('/payment')}
                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl"
                      >
                        Place Order & Pay Deposit <ArrowRight size={18} />
                      </button>
                      <button onClick={prevStep} className="w-full py-4 glass border border-border rounded-xl font-bold">
                        Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
