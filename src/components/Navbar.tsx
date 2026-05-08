import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ShoppingCart, LayoutDashboard, Terminal, Home as HomeIcon, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <HomeIcon className="w-4 h-4" /> },
    { name: 'Tools', path: '/tools', icon: <Terminal className="w-4 h-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: <ShieldAlert className="w-4 h-4" /> });
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 py-4 md:px-8",
      scrolled ? "md:py-4" : "md:py-8"
    )}>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border-2 transition-all duration-300",
          scrolled 
            ? "glass border-neon-yellow shadow-neon translate-y-2" 
            : "border-white/20 bg-white/5 backdrop-blur-sm shadow-xl"
        )}
      >
        <Link to="/" className="flex items-center gap-4 group">
          <div className="bg-neon-yellow border-2 border-black p-2 rounded-xl shadow-brutal transform group-hover:rotate-12 transition-transform">
            <Shield className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter">
            Xyraa<span className="text-neon-yellow">License</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "font-display text-xs font-black uppercase tracking-widest hover:text-neon-yellow transition-colors relative group",
                location.pathname === link.path ? "text-neon-yellow" : "text-zinc-400"
              )}
            >
              <div className="flex items-center gap-1.5">
                {link.icon}
                {link.name}
              </div>
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
              />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <button 
              onClick={logout}
              className="px-6 py-2 border-2 border-electric-red rounded-2xl font-black uppercase text-[10px] tracking-widest text-electric-red hover:bg-electric-red hover:text-white transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Terminate
            </button>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2 border-2 border-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
                Login
              </Link>
              <Link to="/register" className="px-6 py-2 bg-electric-purple border-2 border-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 glass border-white/20 rounded-2xl overflow-hidden px-4"
          >
            <div className="py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors font-display uppercase font-black text-xs"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-center p-3 font-display uppercase font-black text-[10px] tracking-widest border-2 border-electric-red text-electric-red rounded-xl"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center p-3 font-display uppercase font-black text-[10px] tracking-widest border-2 border-white rounded-xl">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center p-3 font-display uppercase font-black text-[10px] tracking-widest bg-electric-purple border-2 border-black shadow-brutal rounded-xl">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
