import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrutalButton from '../components/ui/BrutalButton';
import BrutalCard from '../components/ui/BrutalCard';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
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
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <BrutalCard className="backdrop-blur-xl border-neon-yellow shadow-neon">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-neon-yellow rounded-2xl flex items-center justify-center border-4 border-black mx-auto mb-6 shadow-brutal -rotate-3">
              <Shield className="text-black w-10 h-10" />
            </div>
            <h2 className="font-display font-black text-3xl uppercase tracking-tighter italic">
              WELCOME <span className="text-neon-yellow">BACK</span>
            </h2>
            <p className="text-zinc-500 font-display uppercase tracking-widest text-[10px] mt-2 font-bold">Initiating session authentication...</p>
          </div>

          <div className="space-y-6">
            <BrutalButton 
              variant="neon" 
              fullWidth 
              size="lg" 
              onClick={handleLogin}
              disabled={isAuthenticating}
            >
              <Chrome className="inline-block mr-2 w-5 h-5" /> 
              {isAuthenticating ? 'AUTHENTICATING...' : 'SIGN IN WITH GOOGLE'}
            </BrutalButton>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-zinc-950 px-2 text-zinc-600 tracking-[0.3em]">Vault Access</span></div>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-relaxed text-center italic">
                Authentication is handled securely via encrypted protocol V4.0. No credentials are stored locally.
              </p>
            </div>
          </div>

          <p className="text-center mt-8 text-zinc-500 text-xs font-medium uppercase tracking-widest">
            New operative? <Link to="/register" className="text-white font-black hover:text-neon-yellow underline decoration-neon-yellow decoration-2 underline-offset-4">Join Xyraa</Link>
          </p>
        </BrutalCard>
      </motion.div>
    </div>
  );
}
