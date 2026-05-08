import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Chrome, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalCard from '../components/ui/BrutalCard';

export default function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegister = async () => {
    setIsAuthenticating(true);
    try {
      await login();
    } catch (error) {
      console.error(error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <BrutalCard className="backdrop-blur-xl border-white shadow-brutal">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-4 border-black mx-auto mb-6 shadow-brutal rotate-3">
              <UserPlus className="text-black w-10 h-10" />
            </div>
            <h2 className="font-display font-black text-3xl uppercase tracking-tighter italic">
              JOIN THE <span className="text-neon-yellow">NETWORK</span>
            </h2>
            <p className="text-zinc-500 font-display uppercase tracking-widest text-[10px] mt-2 font-bold">New Operative Registration Protocol...</p>
          </div>

          <div className="space-y-6">
            <BrutalButton 
              variant="neon" 
              fullWidth 
              size="lg" 
              onClick={handleRegister}
              disabled={isAuthenticating}
            >
              <Chrome className="inline-block mr-2 w-5 h-5" /> 
              {isAuthenticating ? 'ENLISTING...' : 'ENLIST WITH GOOGLE'}
            </BrutalButton>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-zinc-950 px-2 text-zinc-600 tracking-[0.3em]">Central Enlistment</span></div>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-relaxed text-center italic">
                Operatives are vetted via decentralized identity protocols. By enlisting, you agree to the System Mandates.
              </p>
            </div>
          </div>

          <p className="text-center mt-8 text-zinc-500 text-xs font-medium uppercase tracking-widest">
            Already registered? <Link to="/login" className="text-white font-black hover:text-neon-yellow underline decoration-neon-yellow decoration-2 underline-offset-4">Acess Terminal</Link>
          </p>
        </BrutalCard>
      </motion.div>
    </div>
  );
}
