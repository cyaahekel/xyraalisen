import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Download, Lock, Package, 
  FileCode, Zap, ExternalLink, ArrowRight,
  ShieldAlert, Terminal, Layers
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import BrutalCard from '../components/ui/BrutalCard';
import BrutalButton from '../components/ui/BrutalButton';
import { useNavigate } from 'react-router-dom';

interface ToolData {
  id: string;
  name: string;
  desc: string;
  category: string;
  tier: 'BASIC' | 'PREMIUM';
  locked: boolean;
  downloadUrl?: string;
  icon?: string;
}

interface LicenseData {
  type: string;
  status: string;
}

const ICON_MAP: Record<string, any> = {
  Terminal, FileCode, ShieldAlert, Package, Zap, Layers
};

export default function ToolsStore() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [tools, setTools] = useState<ToolData[]>([]);
  const [userLicenses, setUserLicenses] = useState<LicenseData[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['ALL', 'TOOLS', 'FILES', 'SCRIPTS', 'PREMIUM'];

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'licenses'), where('userId', '==', user.uid), where('status', '==', 'ACTIVE'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data()) as LicenseData[];
      setUserLicenses(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, 'tools'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ToolData[];
      if (data.length > 0) {
        setTools(data);
      } else {
        setTools([
          { 
            id: '1', 
            name: 'Xy-Packet_Sniffer', 
            desc: 'Real-time neural packet analysis and injection suite.', 
            category: 'TOOLS', 
            tier: 'PREMIUM',
            icon: 'Terminal',
            locked: true
          },
          { 
            id: '2', 
            name: 'Shadow_Logger v2', 
            desc: 'Stealth keylogging module with telegram exfiltration.', 
            category: 'SCRIPTS', 
            tier: 'BASIC',
            icon: 'FileCode',
            locked: false 
          },
          { 
            id: '3', 
            name: 'Ransom_Guard.py', 
            desc: 'Python-based encryption bypass for educational research.', 
            category: 'SCRIPTS', 
            tier: 'PREMIUM',
            icon: 'ShieldAlert',
            locked: true 
          },
          { 
            id: '4', 
            name: 'Database_Explorer', 
            desc: 'Exploration tool for leaked mongo/sql databases.', 
            category: 'TOOLS', 
            tier: 'BASIC',
            icon: 'Package',
            locked: false 
          },
          { 
            id: '5', 
            name: 'Elite_UI_Assets', 
            desc: 'Premium neobrutalist source files (1JT value).', 
            category: 'FILES', 
            tier: 'PREMIUM',
            icon: 'Layers',
            locked: true 
          },
        ]);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'tools'));
    return () => unsubscribe();
  }, []);

  const hasPremium = userLicenses.some(l => ['MONTHLY', '5MONTHS', 'PERMANENT', 'WEEKLY'].includes(l.type));

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToolAction = (tool: ToolData) => {
    const isLocked = tool.tier === 'PREMIUM' && !hasPremium;
    if (isLocked) {
      navigate('/buy');
    } else {
      // Simulate download
      alert(`Downloading ${tool.name}... Access protocol established.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h1 className="font-display font-black text-6xl uppercase tracking-tighter italic mb-4">
          TOOLS <span className="text-neon-yellow">VAULT</span>
        </h1>
        <p className="text-zinc-500 font-display uppercase tracking-widest text-sm font-bold">Access the most advanced cryptographic assets in the network.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search Protocol ID..."
            className="w-full bg-zinc-950 border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-neon-yellow outline-none transition-all font-display uppercase text-sm tracking-widest font-bold placeholder:text-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-4 rounded-2xl border-2 font-display uppercase text-[10px] tracking-widest font-black transition-all whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-neon-yellow text-black border-black shadow-brutal translate-x-[-2px] translate-y-[-2px]' 
                  : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredTools.map((tool) => {
            const Icon = ICON_MAP[tool.icon || 'Package'] || Package;
            const isLocked = tool.tier === 'PREMIUM' && !hasPremium;
            
            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <BrutalCard className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl border-2 border-black shadow-brutal ${isLocked ? 'bg-zinc-800' : 'bg-white'}`}>
                      <Icon className={`w-8 h-8 ${isLocked ? 'text-zinc-500' : 'text-black'}`} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-mono font-black border border-white/10 px-2 py-1 rounded bg-zinc-950 uppercase tracking-tighter">
                        CID: {tool.id.substring(0, 4)}
                      </span>
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-red/10 border border-electric-red/20 text-electric-red text-[8px] font-black uppercase tracking-widest">
                          <Lock className="w-3 h-3" /> Locked
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-[8px] font-black uppercase tracking-widest">
                          Available
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display font-black text-xl uppercase mb-3 group-hover:text-neon-yellow transition-colors">{tool.name}</h3>
                  <p className="text-zinc-500 text-sm font-medium mb-8 flex-grow leading-relaxed">
                    {tool.desc}
                  </p>

                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Access Tier</span>
                      <span className={`text-[10px] font-bold uppercase ${tool.tier === 'PREMIUM' ? 'text-neon-yellow' : 'text-white'}`}>
                        {tool.tier}
                      </span>
                    </div>
                    <BrutalButton 
                      variant={isLocked ? 'outline' : 'neon'} 
                      size="sm"
                      className="flex-grow md:flex-grow-0"
                      onClick={() => handleToolAction(tool)}
                    >
                      {isLocked ? (
                        <span className="flex items-center gap-2">Buy License <ExternalLink className="w-4 h-4" /></span>
                      ) : (
                        <span className="flex items-center gap-2">Download <Download className="w-4 h-4" /></span>
                      )}
                    </BrutalButton>
                  </div>
                </BrutalCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredTools.length === 0 && !loading && (
        <div className="py-40 text-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-white/20">
            <Search className="w-8 h-8 text-zinc-700" />
          </div>
          <p className="font-display font-black text-xl uppercase text-zinc-600 italic tracking-tighter">No encrypted assets found matching query</p>
        </div>
      )}
    </div>
  );
}
