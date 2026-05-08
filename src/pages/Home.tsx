import { motion } from 'motion/react';
import { Shield, Sparkles, Zap, Lock, CreditCard, Layers, ArrowRight, Check } from 'lucide-react';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalCard from '../components/ui/BrutalCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [liveUsers, setLiveUsers] = useState(1243);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { title: 'Military Grade', desc: 'Encrypted license delivery system via neural network.', icon: Shield, color: 'text-neon-yellow' },
    { title: 'Instant Activation', desc: 'Zero-latency key generation and activation logs.', icon: Zap, color: 'text-neon-green' },
    { title: 'HWID Protection', desc: 'Secure hardware-id locking for premium tools.', icon: Lock, color: 'text-electric-purple' },
    { title: 'SaaS Ready', desc: 'Scalable infrastructure for enterprise-level tools.', icon: Layers, color: 'text-electric-red' },
  ];

  const pricing = [
    { name: 'Weekly', price: 'Rp 50k', duration: '7 DAYS', features: ['All Tools Access', '1 Device Link', 'Standard Support', 'Manual Refresh'], color: 'border-white' },
    { name: 'Monthly', price: 'Rp 100k', duration: '30 DAYS', features: ['All Tools Access', '2 Device Links', 'Priority Support', 'Auto HWID Reset'], color: 'border-neon-yellow', highlight: true },
    { name: '5 Months', price: 'Rp 500k', duration: '150 DAYS', features: ['All Tools Access', '3 Device Links', 'VIP Support', 'Unlimited Resets'], color: 'border-electric-purple' },
    { name: 'File (Life)', price: 'Rp 1JT', duration: 'LIFE', features: ['Unlimited Tools', 'No Device Limits', 'Private Discord', 'Beta Access'], color: 'border-neon-green' },
  ];

  return (
    <div className="flex flex-col gap-24 relative overflow-hidden">
      {/* Animated Gradient Background Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-purple/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-yellow/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-neon-yellow" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">New v4.0 Engine Live</span>
          </div>

          <h1 className="font-display font-black text-7xl md:text-[140px] leading-[0.85] uppercase tracking-tighter mb-12 italic">
            SECURE THE <br />
            <span className="text-stroke">FUTURE</span> <br />
            OF <span className="text-neon-yellow underline underline-offset-8 decoration-8">ACCESS.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl font-medium mb-12 px-4">
            The most advanced neobrutalist license ecosystem for professional hackers, 
            developers, and SaaS enthusiasts.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <BrutalButton variant="neon" size="lg" className="group">
              Get Started Now <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </BrutalButton>
            <BrutalButton variant="outline" size="lg">
              Explore Tools
            </BrutalButton>
          </div>
        </motion.div>

        {/* Live Counter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex items-center gap-8 px-8 py-4 glass border-white/5 rounded-2xl"
        >
          <div className="flex flex-col items-center">
            <span className="text-neon-green font-mono text-2xl font-bold tracking-tighter leading-none">{liveUsers}</span>
            <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mt-1">Live Users</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-white font-mono text-2xl font-bold tracking-tighter leading-none">42.8K</span>
            <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mt-1">Licenses Issued</span>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 max-w-6xl mx-auto w-full">
        <div className="mb-16">
          <h2 className="font-display font-black text-4xl uppercase tracking-tighter mb-2 italic">
            CORE <span className="text-neon-yellow">PROTOCOLS</span>
          </h2>
          <p className="text-zinc-500 font-medium font-display uppercase tracking-widest text-xs">Unmatched security framework</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <BrutalCard key={i} className="group">
              <feature.icon className={`w-10 h-10 ${feature.color} mb-6 transform group-hover:scale-110 transition-transform`} />
              <h3 className="font-display font-black text-xl uppercase mb-3">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                {feature.desc}
              </p>
            </BrutalCard>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 max-w-6xl mx-auto w-full py-20 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-yellow/5 blur-[150px] -z-10 rounded-full" />
        
        <div className="text-center mb-20">
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter mb-4 italic leading-none">
            SELECT YOUR <span className="text-neon-yellow underline decoration-4 underline-offset-8">TIER</span>
          </h2>
          <p className="text-zinc-500 font-display uppercase tracking-widest text-sm">Flexible plans for every operational need</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pricing.map((tier, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`relative flex flex-col p-8 rounded-brutal border-2 ${tier.color} ${tier.highlight ? 'bg-zinc-900 shadow-neon' : 'bg-zinc-950'} transition-all`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-yellow text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-brutal border-2 border-black">
                  Recommended
                </div>
              )}
              
              <span className="font-display uppercase font-black text-sm tracking-widest text-zinc-500 mb-2">{tier.name}</span>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-display font-black tracking-tighter italic">{tier.price}</span>
                <span className="text-zinc-600 font-mono text-xs uppercase">/ {tier.duration}</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-neon-green" />
                    <span className="text-zinc-400 text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>

              <BrutalButton variant={tier.highlight ? 'neon' : 'outline'} fullWidth>
                Purchase Access
              </BrutalButton>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 max-w-6xl mx-auto w-full py-20 bg-zinc-950/50 rounded-[40px] border-2 border-white/5 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-electric-purple/10 rounded-full blur-[100px]" />
        
        <div className="text-center mb-16 px-4">
          <h2 className="font-display font-black text-4xl uppercase tracking-tighter italic italic leading-none mb-4">OPERATIVE <span className="text-neon-yellow">FEEDBACK</span></h2>
          <p className="text-zinc-500 font-display uppercase tracking-widest text-[10px] font-bold tracking-[0.2em]">// Decrypted Satisfaction Logs //</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'X_Shadow', role: 'Security Researcher', text: 'The cleanest license system I’ve ever used. Neobrutalism actually fits the hacker vibe perfectly. 10/10.', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=1' },
            { name: 'NullPointer', role: 'Fullstack Dev', text: 'Instant activation and the HWID locking is rock solid. My tools have never been more secure than on Xyraa.', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=2' },
            { name: 'NeonRipper', role: 'SaaS Founder', text: 'Transitioned my entire user database to Xyraa. The admin panel gives me total authority over my assets.', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=3' },
          ].map((t, i) => (
            <BrutalCard key={i} className="bg-zinc-900/50">
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} className="w-12 h-12 rounded-xl border-2 border-neon-yellow shadow-brutal -rotate-3" alt={t.name} />
                <div>
                  <h4 className="font-display font-black uppercase text-sm leading-none">{t.name}</h4>
                  <p className="text-zinc-600 font-mono text-[8px] uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm font-medium italic leading-relaxed">"{t.text}"</p>
            </BrutalCard>
          ))}
        </div>
      </section>

      {/* FAQ Staging */}
      <section className="px-6 max-w-4xl mx-auto w-full mb-40">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-4xl uppercase tracking-tighter italic">COMMON <span className="text-neon-yellow">QUERIES</span></h2>
        </div>
        <div className="space-y-4">
          {[
            { q: 'Is it HWID locked?', a: 'Yes, our licenses are strongly bound to your hardware fingerprint to prevent unauthorized sharing.' },
            { q: 'What payment methods?', a: 'We accept QRIS, Crypto, and Bank Transfers via automated verification systems.' },
            { q: 'Can I reset my key?', a: 'Monthly and Life tiers include self-service HWID resets via the user dashboard.' },
          ].map((faq, i) => (
            <BrutalCard key={i} className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-display font-black uppercase tracking-tight text-lg">{faq.q}</span>
                  <ArrowRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-zinc-400 font-medium border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            </BrutalCard>
          ))}
        </div>
      </section>
    </div>
  );
}
