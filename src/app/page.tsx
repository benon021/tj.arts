import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeaturedTemplates from "@/components/landing/FeaturedTemplates";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedTemplates />
      
      {/* How It Works Section */}
      <section className="py-24 glass border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 underline-offset-8">How it <span className="gold-gradient italic">Works</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Upload Photos', desc: 'Choose your favorite high-quality images. Up to 3 photos per artwork.' },
              { step: '02', title: 'Select Template', desc: 'Pick from our curated library of cinematic and luxury frames.' },
              { step: '03', title: 'Get Your Art', desc: 'Review your preview, pay a deposit, and receive high-res artwork.' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-6xl font-serif font-black text-white/5 mb-[-2rem]">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">{item.title}</h3>
                <p className="text-muted-foreground font-light max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 text-center">
        <p className="text-sm text-muted-foreground">© 2024 LUMIAXY ART STUDIO. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-xs hover:text-primary">Instagram</a>
          <a href="#" className="text-xs hover:text-primary">Facebook</a>
          <a href="#" className="text-xs hover:text-primary">Contact</a>
        </div>
      </footer>
    </main>
  );
}
