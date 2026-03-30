'use client'

import { useState } from 'react'
import Navbar from '@/components/landing/Navbar'
import { motion } from 'framer-motion'
import { Phone, ShieldCheck, CreditCard, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useOrderStore } from '@/store/useOrderStore'
import { supabase } from '@/lib/supabase'

export default function PaymentPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { titleText, templateId } = useOrderStore()

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate M-Pesa STK Push
    setTimeout(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('No session')
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            templateId: templateId || 'unknown',
            title: titleText || 'Custom Artwork',
            phoneNumber: phoneNumber,
            price: 3500,
            depositPaid: 1750
          })
        })

        if (!response.ok) {
          throw new Error('Failed to save order')
        }

        setLoading(false)
        setSuccess(true)
      } catch (error) {
        console.error('Payment Error:', error)
        setLoading(false)
        alert('Payment initiated but failed to record order. Please contact support.')
      }
    }, 3000)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-12 rounded-3xl border border-primary/20 text-center max-w-md shadow-2xl"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-primary" size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Payment Initiated</h2>
          <p className="text-muted-foreground font-light mb-8 leading-relaxed">
            Please check your phone for the M-Pesa STK push and enter your PIN to confirm the KES 1,750 deposit.
          </p>
          <div className="space-y-4">
            <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20">
              View Order Status
            </button>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">A confirmation SMS will be sent shortly.</p>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Payment Form */}
          <div className="flex-[1.5] space-y-8">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-4">Secure <span className="gold-gradient italic">Checkout</span></h1>
              <p className="text-muted-foreground font-light">Complete your deposit to lock in your artist&apos;s schedule.</p>
            </div>

            <div className="glass p-8 rounded-3xl border border-border/50 space-y-8">
              <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                <CreditCard className="text-primary" size={24} />
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary">M-Pesa Express</p>
                  <p className="text-xs text-muted-foreground">Direct STK push to your phone</p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 254712345678"
                      className="w-full bg-black/40 border border-border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-white/20"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-1">Format: 254XXXXXXXXX</p>
                </div>

                <div className="p-4 bg-white/5 border border-border rounded-2xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Original Price</span>
                    <span>KES 3,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deposit Required (50%)</span>
                    <span className="text-primary font-bold">KES 1,750</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border/50">
                    <span className="font-bold">Total Payable Now</span>
                    <span className="text-xl font-bold gold-gradient italic underline underline-offset-4 decoration-primary/30">KES 1,750</span>
                  </div>
                </div>

                <button
                  disabled={loading || phoneNumber.length < 10}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>Pay via M-Pesa <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em]">
                <ShieldCheck size={14} /> Encrypted Secure Transaction
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="flex-1">
            <div className="glass p-8 rounded-3xl border border-border/50 space-y-6 sticky top-32">
              <h3 className="text-xl font-serif font-bold pb-4 border-b border-border/50">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-black/40 rounded-lg overflow-hidden border border-border/50 relative">
                    <Image src="/templates/netflix.png" alt="summary" fill className="object-cover opacity-50" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{templateId || 'Art'}</p>
                    <p className="text-sm font-bold truncate max-w-[120px]">{titleText || 'Custom Artwork'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Status: Pending</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <p className="text-xs text-muted-foreground italic font-light">
                  &quot;Completion estimated within 2-3 business days after deposit verification.&quot;
                </p>
                <div className="pt-4 flex items-center gap-2 text-primary">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">TJ.ARTS GENUINE ARTWORK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
