import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowRight } from 'lucide-react';
import BrutalButton from '../components/ui/BrutalButton';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-32 h-32 bg-electric-red rounded-3xl flex items-center justify-center border-4 border-black shadow-brutal mb-12"
      >
        <ShieldAlert className="text-black w-16 h-16" />
      </motion.div>
      
      <h1 className="font-display font-black text-6xl md:text-9xl uppercase tracking-tighter italic mb-4 leading-none">
        PROTOCOL <span className="text-electric-red underline decoration-8 underline-offset-8">404</span>
      </h1>
      <p className="text-zinc-500 font-display uppercase tracking-[0.3em] font-black text-xs mb-12">// UNAUTHORIZED_STASIS_ZONE_DETECTED //</p>
      
      <p className="max-w-md mx-auto text-zinc-400 font-medium text-lg mb-12 leading-relaxed">
        You have drifted into an unmapped coordinate of the Xyraa Network. 
        Initiate navigation protocol to return to safety.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <Link to="/">
          <BrutalButton variant="neon" size="lg">
            <Home className="inline-block mr-2 w-5 h-5" /> RETURN TO HOME
          </BrutalButton>
        </Link>
        <BrutalButton variant="outline" size="lg">
          REPORT ANOMALY <ArrowRight className="inline-block ml-2 w-5 h-5" />
        </BrutalButton>
      </div>
    </div>
  );
}
