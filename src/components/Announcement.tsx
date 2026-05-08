import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, X, ArrowRight } from 'lucide-react';
import BrutalButton from './ui/BrutalButton';

export default function Announcement() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed bottom-10 left-6 right-6 md:left-auto md:right-10 z-50 md:w-96">
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            className="bg-electric-purple text-white p-6 rounded-brutal border-2 border-black shadow-brutal relative overflow-hidden"
          >
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Megaphone className="text-black w-5 h-5" />
              </div>
              <h4 className="font-display font-black uppercase tracking-tighter text-xl italic">PROTOCOL_UPDATE</h4>
            </div>

            <p className="text-sm font-medium mb-6 leading-relaxed">
              XyraaLicense v4.0 is now live. New HWID protection modules and permanent license tiers are available for deployment.
            </p>

            <BrutalButton 
              variant="primary" 
              size="sm" 
              fullWidth 
              className="bg-black text-white hover:bg-zinc-900"
              onClick={() => setShow(false)}
            >
              ACKNOWLEDGE <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </BrutalButton>
            
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
