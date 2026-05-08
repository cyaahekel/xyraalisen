import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Smartphone, Landmark, Check, 
  ArrowRight, ShieldCheck, Zap, Globe, Cpu, Layers
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import BrutalCard from '../components/ui/BrutalCard';
import BrutalButton from '../components/ui/BrutalButton';

export default function BuyLicense() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    { 
      id: 'weekly', 
      name: 'Alpha_Weekly', 
      price: 'Rp 50.000', 
      amount: 50000,
      desc: '1 Minggu access for mission critical tasks.',
      features: ['7 Days Access', '1 HWID Link', 'Standard Support'],
      icon: Zap,
      color: 'border-white'
    },
    { 
      id: 'monthly', 
      name: 'Beta_Monthly', 
      price: 'Rp 100.000', 
      amount: 100000,
      desc: '1 Bulan extended coverage for active operatives.',
      features: ['30 Days Access', '2 HWID Links', 'Priority Support', 'Self HWID Reset'],
      icon: Globe,
      color: 'border-neon-yellow',
      highlight: true
    },
    { 
      id: '5months', 
      name: 'Gamma_5Months', 
      price: 'Rp 500.000', 
      amount: 500000,
      desc: '5 Bulan intensive security protocol.',
      features: ['150 Days Access', '3 HWID Links', 'VIP Support', 'Unlimited Resets'],
      icon: Layers,
      color: 'border-electric-purple'
    },
    { 
      id: 'permanent', 
      name: 'Omega_File', 
      price: 'Rp 1.000.000', 
      amount: 1000000,
      desc: 'Lifetime control. Ultimate FILE access.',
      features: ['Unlimited Access', 'No Device Limits', 'Dev Beta Access', 'Private Discord'],
      icon: Cpu,
      color: 'border-neon-green'
    },
  ];

  const paymentMethods = [
    { id: 'qris', name: 'QRIS / E-WALLET', icon: Smartphone, desc: 'Dana, OVO, GoPay, LinkAja' },
    { id: 'bank', name: 'BANK TRANSFER', icon: Landmark, desc: 'Automatic Verification 24/7' },
    { id: 'cc', name: 'CREDIT CARD', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
  ];

  const handleInitializePayment = async () => {
    if (!user || !selectedPlan || !paymentMethod) return;
    setIsProcessing(true);
    try {
      const plan = plans.find(p => p.id === selectedPlan);
      const docRef = await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        userName: user.displayName || user.email,
        planId: selectedPlan,
        amount: plan?.amount,
        status: 'PENDING',
        method: paymentMethod,
        createdAt: serverTimestamp()
      });
      
      setTransactionId(docRef.id);
      
      await addDoc(collection(db, 'activity_logs'), {
        userId: user.uid,
        event: 'PAYMENT_INITIATED',
        timestamp: serverTimestamp(),
        status: 'PENDING'
      });
      
      setStep(3);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'transactions');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-20 text-center">
        <h1 className="font-display font-black text-6xl uppercase tracking-tighter italic mb-4">
          ACQUIRE <span className="text-neon-yellow">CLEARANCE</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className={`w-8 h-1 rounded-full ${step >= 1 ? 'bg-neon-yellow' : 'bg-zinc-800'}`} />
          <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-neon-yellow' : 'bg-zinc-800'}`} />
          <div className={`w-8 h-1 rounded-full ${step >= 3 ? 'bg-neon-yellow' : 'bg-zinc-800'}`} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer relative flex flex-col p-6 rounded-brutal border-4 transition-all group
                  ${selectedPlan === plan.id ? 'bg-zinc-900 border-neon-yellow shadow-neon translate-x-[-4px] translate-y-[-4px]' : 'bg-zinc-950 border-black hover:border-white/20'}
                `}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl border-2 border-black shadow-brutal ${selectedPlan === plan.id ? 'bg-neon-yellow text-black' : 'bg-zinc-800 group-hover:bg-white group-hover:text-black transition-colors'}`}>
                    <plan.icon className="w-5 h-5" />
                  </div>
                  {plan.highlight && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-neon-yellow">Most Popular</span>
                  )}
                </div>

                <h3 className="font-display font-black text-xl uppercase italic tracking-tighter mb-2 leading-none">{plan.name}</h3>
                <p className="text-zinc-500 text-[10px] font-medium mb-6 uppercase tracking-wider">{plan.desc}</p>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-display font-black tracking-tighter italic">{plan.price}</span>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className={`w-3 h-3 ${selectedPlan === plan.id ? 'text-neon-yellow' : 'text-zinc-600'}`} />
                      <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-tight">{f}</span>
                    </div>
                  ))}
                </div>

                <BrutalButton 
                  variant={selectedPlan === plan.id ? 'neon' : 'outline'} 
                  fullWidth
                  onClick={() => setStep(2)}
                  className="text-xs"
                >
                  Select Protocol
                </BrutalButton>
              </motion.div>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto w-full"
          >
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-display font-black text-3xl uppercase italic tracking-tighter">SELECT <span className="text-neon-yellow">GATEWAY</span></h2>
              <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                &larr; Re-evaluate Plan
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`cursor-pointer flex items-center gap-6 p-6 rounded-brutal border-4 transition-all
                    ${paymentMethod === method.id ? 'bg-neon-yellow text-black border-black shadow-brutal translate-x-[-4px] translate-y-[-4px]' : 'bg-zinc-950 border-black hover:border-white/20'}
                  `}
                >
                  <div className={`p-4 rounded-xl border-2 border-black ${paymentMethod === method.id ? 'bg-white' : 'bg-zinc-900 group-hover:bg-white'}`}>
                    <method.icon className={`w-8 h-8 ${paymentMethod === method.id ? 'text-black' : 'text-zinc-500'}`} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-display font-black text-xl leading-none mb-1 uppercase italic tracking-tighter">{method.name}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${paymentMethod === method.id ? 'text-black/60' : 'text-zinc-500'}`}>{method.desc}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                      <Check className="text-neon-yellow w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <BrutalButton 
                variant="neon" 
                fullWidth 
                size="lg" 
                disabled={!paymentMethod || isProcessing}
                onClick={handleInitializePayment}
              >
                {isProcessing ? 'PROCESSING...' : 'INITIALIZE PAYMENT'} <ArrowRight className="inline-block ml-2 w-6 h-6" />
              </BrutalButton>
              <div className="flex items-center justify-center gap-3 mt-6 text-zinc-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Encrypted Transaction Protocol v4.0</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-10"
          >
            <BrutalCard className="bg-zinc-900">
              <div className="w-20 h-20 bg-neon-yellow rounded-full flex items-center justify-center border-4 border-black mx-auto mb-8 shadow-brutal animate-pulse">
                <Smartphone className="text-black w-10 h-10" />
              </div>
              <h2 className="font-display font-black text-4xl uppercase tracking-tighter italic mb-4">PAYMENT_STAGING</h2>
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-10">
                Scan the QRIS code below and complete payment. <br/>
                <span className="text-white">Admin will verify your proof immediately.</span>
              </p>

              <div className="bg-white p-6 inline-block rounded-3xl border-4 border-black mb-10 shadow-brutal mx-auto">
                {/* Generic QRIS placeholder image */}
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=XyraaLicensePaymentID-55XX" 
                  alt="QRIS Payment"
                  className="w-48 h-48"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-[10px] font-black text-black">POWERED BY</span>
                  <div className="bg-black text-white px-2 py-0.5 rounded font-black text-[8px]">QRIS</div>
                </div>
              </div>

              <div className="bg-zinc-950 p-6 rounded-2xl border-2 border-white/5 mb-10 text-left">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Amount</span>
                  <span className="text-neon-yellow font-display font-black text-xl italic">{plans.find(p => p.id === selectedPlan)?.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Tx ID</span>
                  <span className="text-white font-mono text-[10px] uppercase">{transactionId?.substring(0, 12)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <BrutalButton variant="outline" fullWidth onClick={() => setStep(2)}>
                  BACK
                </BrutalButton>
                <BrutalButton variant="neon" fullWidth onClick={() => setStep(1)}>
                  I HAVE PAID
                </BrutalButton>
              </div>
            </BrutalCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
