import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, MessageSquare, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 px-6 border-t-2 border-white/5 bg-zinc-950 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-neon-yellow rounded-lg flex items-center justify-center border-2 border-black">
              <Shield className="text-black w-5 h-5" />
            </div>
            <span className="font-display font-black text-xl tracking-tighter uppercase italic">
              Xyraa<span className="text-neon-yellow">License</span>
            </span>
          </Link>
          <p className="text-zinc-500 max-w-sm mb-8 font-medium leading-relaxed">
            The next generation of license management. Secure, fast, and built for modern developers. 
            Empower your tools with our futuristic neobrutalist ecosystem.
          </p>
          <div className="flex gap-4">
            {[Github, Twitter, MessageSquare].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-neon-yellow hover:text-black transition-all hover:-translate-y-1">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display uppercase font-black text-sm tracking-widest mb-6 text-zinc-300">Platform</h4>
          <ul className="space-y-4">
            {['Tools Store', 'Pricing', 'API Docs', 'Status'].map((item) => (
              <li key={item}>
                <Link to="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-neon-yellow transition-colors" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase font-black text-sm tracking-widest mb-6 text-zinc-300">Support</h4>
          <ul className="space-y-4">
            {['Knowledge Base', 'Discord Server', 'Terms of Service', 'Privacy Policy'].map((item) => (
              <li key={item}>
                <Link to="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-neon-yellow transition-colors" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-10 mt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
          &copy; 2024 XYRAA SYSTEMS. ALL RIGHTS PROTECTED.
        </p>
        <div className="flex items-center gap-6">
          <p className="text-zinc-600 text-[10px] font-mono leading-none tracking-tighter uppercase">
            VERSION 4.0.2 // STABLE_BUILD
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-neon-green text-[10px] font-mono uppercase">System Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
