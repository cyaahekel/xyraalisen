import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Zap, Clock, Copy, Download, History, 
  Settings, Bell, Activity, Key, LogOut, Check,
  AlertTriangle, TrendingUp, Users
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import BrutalCard from '../components/ui/BrutalCard';
import BrutalButton from '../components/ui/BrutalButton';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface LicenseData {
  id: string;
  key: string;
  type: string;
  status: string;
  expiresAt: any;
}

interface LogData {
  event: string;
  timestamp: any;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [harvestSuccess, setHarvestSuccess] = useState(false);
  const [nextKeyTime, setNextKeyTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [licenses, setLicenses] = useState<LicenseData[]>([]);
  const [activityLogs, setActivityLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Licenses
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'licenses'), 
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LicenseData[];
      setLicenses(data);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'licenses'));
    return () => unsubscribe();
  }, [user]);

  // Fetch Activity Logs
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'activity_logs'), 
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data()) as LogData[];
      setActivityLogs(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'activity_logs'));
    return () => unsubscribe();
  }, [user]);

  // Key Generator Timer
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      let lastResetTime = 0;
      if ((user as any).lastFreeKeyAt) {
        const lastReset = (user as any).lastFreeKeyAt?.toDate?.() || new Date(0);
        lastResetTime = lastReset.getTime();
      }
      
      const cooldown = 5 * 60 * 60 * 1000; // 5 hours
      const now = Date.now();
      const elapsed = now - lastResetTime;
      const remaining = Math.max(0, cooldown - elapsed);
      setNextKeyTime(Math.floor(remaining / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const h = Math.floor(nextKeyTime / 3600);
    const m = Math.floor((nextKeyTime % 3600) / 60);
    const s = nextKeyTime % 60;
    setTimeLeft({ h, m, s });
  }, [nextKeyTime]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHarvestKey = async () => {
    if (!user || nextKeyTime > 0) return;
    try {
      // 1. Update user cooldown
      await updateDoc(doc(db, 'users', user.uid), {
        lastFreeKeyAt: serverTimestamp()
      });

      // 2. Create a new weekly license
      const newKey = `FREE-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      await addDoc(collection(db, 'licenses'), {
        userId: user.uid,
        key: newKey,
        type: 'WEEKLY',
        status: 'ACTIVE',
        expiresAt: Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp()
      });

      // 3. Log the activity
      await addDoc(collection(db, 'activity_logs'), {
        userId: user.uid,
        event: 'FREE_KEY_HARVESTED',
        timestamp: serverTimestamp(),
        status: 'STABLE'
      });

      setHarvestSuccess(true);
      setTimeout(() => setHarvestSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'licenses');
    }
  };

  const chartData = {
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    datasets: [
      {
        label: 'KEY_USAGE',
        data: [12, 19, 15, 8, 22, 30, 25],
        borderColor: '#DFFA00',
        backgroundColor: 'rgba(223, 255, 0, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#DFFA00',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000',
        titleFont: { family: 'Space Grotesk' },
        bodyFont: { family: 'Space Grotesk' },
        borderColor: '#CCFF00',
        borderWidth: 1,
      }
    },
    scales: {
      y: { display: false },
      x: { 
        grid: { display: false },
        ticks: { color: '#52525b', font: { family: 'JetBrains Mono', size: 10 } }
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display font-black text-5xl uppercase tracking-tighter italic leading-none mb-2">
            WELCOME, <span className="text-neon-yellow">{user.displayName?.split(' ')[0] || 'OPERATIVE'}</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Protocol: XY-PROT-402 // Security Level: {user.role === 'ADMIN' ? '01' : '04'}</p>
        </div>
        <div className="flex gap-4">
          <BrutalButton variant="secondary" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden md:inline">Alerts</span>
          </BrutalButton>
          <BrutalButton variant="danger" className="flex items-center gap-2" onClick={logout}>
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Terminate</span>
          </BrutalButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <BrutalCard className="bg-zinc-900/50 border-white/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl border-4 border-neon-yellow overflow-hidden shadow-brutal rotate-3">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-neon-green p-2 rounded-xl border-2 border-black">
                  <Shield className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="text-center md:text-left flex-grow">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter">{user.displayName}</h2>
                  <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-black font-mono text-zinc-400 uppercase tracking-widest">
                    {user.role === 'ADMIN' ? 'Overseer' : 'Alpha Operative'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1 font-mono">Status</p>
                    <p className="text-neon-green font-mono font-bold text-sm">ONLINE</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1 font-mono">Level</p>
                    <p className="text-white font-mono font-bold text-sm">LEVEL {user.level || 1}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1 font-mono">Rep.</p>
                    <p className="text-electric-purple font-mono font-bold text-sm">{user.rep || 'NEUTRAL'}</p>
                  </div>
                </div>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-black uppercase text-xl italic flex items-center gap-2 tracking-tighter">
                <TrendingUp className="text-neon-yellow" /> Usage Metrics
              </h3>
            </div>
            <div className="h-[250px] w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </BrutalCard>

          <div className="space-y-4">
            <h3 className="font-display font-black uppercase text-xl italic px-2 tracking-tighter">Active Protocols</h3>
            {licenses.length === 0 ? (
              <p className="p-10 text-center text-zinc-600 font-mono italic text-sm border-2 border-dashed border-white/5 rounded-brutal">No active protocols detected. Acquire clearance to proceed.</p>
            ) : (
              licenses.map((license) => (
                <BrutalCard key={license.id} className="p-4 bg-zinc-950">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl border-2 border-black shadow-brutal ${license.status === 'ACTIVE' ? 'bg-neon-green' : 'bg-zinc-700 opacity-50'}`}>
                        <Key className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-lg leading-none mb-1 tracking-tight">{license.type} LICENSE</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${license.status === 'ACTIVE' ? 'text-neon-green' : 'text-zinc-600'}`}>
                            {license.status}
                          </span>
                          <span className="text-zinc-600 text-[10px] uppercase font-mono tracking-widest font-black">•</span>
                          <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">EXP: {license.expiresAt?.toDate().toLocaleDateString() || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                        {license.key}
                      </div>
                      <BrutalButton 
                        variant="neon" 
                        size="sm" 
                        onClick={() => copyToClipboard(license.key)}
                        className="whitespace-nowrap"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </BrutalButton>
                    </div>
                  </div>
                </BrutalCard>
              )
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <BrutalCard className="bg-zinc-900 border-neon-yellow shadow-neon overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-neon-yellow/10 rounded-full blur-[60px]" />
            <div className="relative z-10 text-center">
              <Zap className="w-12 h-12 text-neon-yellow mx-auto mb-6 animate-pulse" />
              <h3 className="font-display font-black text-2xl uppercase tracking-tighter mb-2 italic">Quantum Refill</h3>
              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-8">Refill protocol status: {nextKeyTime > 0 ? 'CHARGING' : 'READY'}</p>
              
              <div className="grid grid-cols-3 gap-2 mb-8">
                {[['hrs', timeLeft.h], ['min', timeLeft.m], ['sec', timeLeft.s]].map(([label, val]) => (
                  <div key={label as string} className="bg-zinc-950 border border-white/10 rounded-2xl py-4 flex flex-col items-center">
                    <span className="text-2xl font-display font-black leading-none mb-1 text-white">
                      {val.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-black">{label as string}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {harvestSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-neon-green text-black py-2 px-4 rounded-xl border-2 border-black font-black text-xs uppercase mb-4 shadow-brutal"
                    >
                      Protocol refilled!
                    </motion.div>
                  )}
                </AnimatePresence>
                <BrutalButton variant="neon" fullWidth disabled={nextKeyTime > 0} onClick={handleHarvestKey}>
                  {nextKeyTime > 0 ? 'PROTOCOL_LOCKED' : 'HARVEST_KEY'}
                </BrutalButton>
                <p className="text-[10px] text-zinc-600 font-mono italic">Limit: 1 Clear / 5 Hours</p>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard>
            <h3 className="font-display font-black uppercase text-lg mb-6 flex items-center gap-2 italic tracking-tighter">
              <Activity className="text-electric-purple w-5 h-5" /> Activity Log
            </h3>
            <div className="space-y-4">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-zinc-700 font-mono italic">Trace log empty.</p>
              ) : (
                activityLogs.map((log, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-electric-purple group-hover:scale-150 transition-transform" />
                    <div className="flex-grow">
                      <p className="text-[10px] font-black font-mono leading-none mb-1 text-zinc-300">{log.event}</p>
                      <p className="text-[8px] text-zinc-600 font-mono tracking-widest uppercase">{log.timestamp?.toDate().toLocaleString() || 'NOW'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </BrutalCard>

          <BrutalCard className="bg-zinc-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Network_Health</span>
              <span className="text-[10px] font-mono text-neon-green uppercase tracking-widest">99.8%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '99.8%' }}
                className="h-full bg-neon-green"
              />
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
