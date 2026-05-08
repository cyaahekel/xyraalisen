import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, CreditCard, Key, TrendingUp, Search, 
  Filter, MoreVertical, Ban, CheckCircle, 
  Download, Plus, ShieldAlert, Activity, ArrowUpRight,
  MessageSquare, Send, X, AlertCircle
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp, updateDoc, doc, Timestamp, getDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import BrutalCard from '../components/ui/BrutalCard';
import BrutalButton from '../components/ui/BrutalButton';
import { Line } from 'react-chartjs-2';

interface TransactionData {
  id: string;
  userId: string;
  userName?: string;
  planId: string;
  amount: number;
  status: string;
  method: string;
  createdAt: any;
}

interface ChatData {
  id: string;
  userId: string;
  message: string;
  sender: 'USER' | 'ADMIN';
  timestamp: any;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ANALYTICS');
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedUserChat, setSelectedUserChat] = useState<string | null>(null);

  // Fetch Transactions
  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TransactionData[];
      setTransactions(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'transactions'));
    return () => unsubscribe();
  }, []);

  // Fetch Chats
  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('timestamp', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ChatData[];
      setChats(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'chats'));
    return () => unsubscribe();
  }, []);

  const handleApproveTransaction = async (tx: TransactionData) => {
    try {
      // 1. Update Transaction Status
      await updateDoc(doc(db, 'transactions', tx.id), {
        status: 'PAID'
      });

      // 2. Create License
      const days = tx.planId === 'weekly' ? 7 : tx.planId === 'monthly' ? 30 : tx.planId === '5months' ? 150 : 9999;
      const keyPrefix = tx.planId.toUpperCase();
      const newKey = `${keyPrefix}-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      
      await addDoc(collection(db, 'licenses'), {
        userId: tx.userId,
        key: newKey,
        type: tx.planId.toUpperCase(),
        status: 'ACTIVE',
        expiresAt: Timestamp.fromMillis(Date.now() + days * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp()
      });

      // 3. Log Activity
      await addDoc(collection(db, 'activity_logs'), {
        userId: tx.userId,
        event: 'TRANSACTION_APPROVED',
        timestamp: serverTimestamp(),
        status: 'SUCCESS'
      });
      
      // Notify Admin
      alert('Transaction Approved & License Created');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'licenses');
    }
  };

  const handleSendReply = async () => {
    if (!selectedUserChat || !replyMessage.trim()) return;
    try {
      await addDoc(collection(db, 'chats'), {
        userId: selectedUserChat,
        message: replyMessage,
        sender: 'ADMIN',
        timestamp: serverTimestamp()
      });
      setReplyMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chats');
    }
  };

  const stats = [
    { label: 'PENDING TX', val: transactions.filter(t => t.status === 'PENDING').length, trend: 'ACTION_REQ', color: 'text-neon-yellow' },
    { label: 'TOTAL REVENUE', val: `Rp ${transactions.filter(t => t.status === 'PAID').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}`, trend: 'REAL', color: 'text-neon-green' },
    { label: 'UNREAD CHATS', val: Array.from(new Set(chats.filter(c => c.sender === 'USER').map(c => c.userId))).length, trend: 'NEW', color: 'text-electric-purple' },
    { label: 'SYSTEM NODES', val: '99', trend: 'STABLE', color: 'text-white' },
  ];

  // Group chats by userId for messaging UI
  const groupedChats = chats.reduce((acc, chat) => {
    if (!acc[chat.userId]) acc[chat.userId] = [];
    acc[chat.userId].push(chat);
    return acc;
  }, {} as Record<string, ChatData[]>);

  const chartData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
    datasets: [
      {
        label: 'SALES_VOLUME',
        data: [4000, 3000, 5000, 8000, 6000, 14290],
        borderColor: '#9D00FF',
        backgroundColor: 'rgba(157, 0, 255, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-electric-red/10 border border-electric-red/20 rounded-full mb-4">
            <div className="w-2 h-2 rounded-full bg-electric-red animate-pulse" />
            <span className="text-[10px] font-black uppercase text-electric-red tracking-widest leading-none">Admin Authority Level 01</span>
          </div>
          <h1 className="font-display font-black text-5xl uppercase tracking-tighter italic leading-none">
            COMMAND <span className="text-electric-red">CENTRAL</span>
          </h1>
        </div>
        
        <div className="flex gap-4 p-2 bg-zinc-950 border-2 border-white/5 rounded-2xl">
          {['ANALYTICS', 'TRANSACTIONS', 'SUPPORT', 'LOGS'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-display font-black text-[10px] tracking-widest transition-all
                ${activeTab === tab ? 'bg-white text-black shadow-brutal translate-y-[-2px]' : 'text-zinc-600 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <BrutalCard key={i} className="bg-zinc-900 border-white/10">
            <p className="text-zinc-500 font-mono text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className={`text-2xl font-display font-black tracking-tighter italic ${stat.color}`}>{stat.val}</span>
              <span className="text-[10px] font-bold font-mono text-zinc-600 flex items-center gap-1">
                {stat.trend}
              </span>
            </div>
          </BrutalCard>
        ))}
      </div>

      <div className="min-h-[60vh]">
        {activeTab === 'ANALYTICS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <BrutalCard className="bg-zinc-950">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display font-black uppercase text-xl italic flex items-center gap-2">
                    <TrendingUp className="text-electric-purple w-6 h-6" /> Revenue Stream
                  </h3>
                  <BrutalButton variant="outline" size="sm">Export Report</BrutalButton>
                </div>
                <div className="h-[300px]">
                  <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }} />
                </div>
              </BrutalCard>
            </div>
            <div className="space-y-8">
              <BrutalCard className="bg-electric-red border-black shadow-brutal text-black">
                <ShieldAlert className="w-12 h-12 mb-6" />
                <h3 className="font-display font-black text-2xl uppercase tracking-tighter mb-2 italic underline decoration-4 underline-offset-4">THREAT_LEVEL: LOW</h3>
                <p className="text-black/70 text-xs font-medium mb-8 leading-relaxed uppercase">
                  System stable. Monitoring protocol ACTIVE.
                </p>
                <BrutalButton variant="secondary" fullWidth className="bg-black text-white hover:bg-zinc-900">Scan Network</BrutalButton>
              </BrutalCard>
            </div>
          </div>
        )}

        {activeTab === 'TRANSACTIONS' && (
          <BrutalCard>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-black uppercase text-xl italic">Inbound Transactions</h3>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-neon-yellow" />
                <span className="text-[10px] font-black font-mono text-zinc-500 uppercase tracking-widest italic">Awaiting human verification</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Operative</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Protocol</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Method</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Credit</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Status</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-display font-bold uppercase tracking-tight text-sm">{tx.userName || 'UNKNOWN'}</span>
                          <span className="text-[8px] text-zinc-600 font-mono italic">{tx.userId.substring(0, 8)}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-black text-zinc-400 uppercase">{tx.planId}</span>
                      </td>
                      <td className="py-4 text-[10px] font-black uppercase text-zinc-500">{tx.method}</td>
                      <td className="py-4 text-white font-mono font-bold text-sm tracking-tighter">Rp {tx.amount?.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${tx.status === 'PAID' ? 'border-neon-green text-neon-green' : 'border-neon-yellow text-neon-yellow'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {tx.status === 'PENDING' && (
                          <BrutalButton variant="neon" size="sm" onClick={() => handleApproveTransaction(tx)}>
                            APPROVE
                          </BrutalButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BrutalCard>
        )}

        {activeTab === 'SUPPORT' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
            <div className="lg:col-span-1 bg-zinc-950 border-4 border-black rounded-brutal p-4 overflow-y-auto">
              <h4 className="font-display font-black uppercase text-[10px] tracking-widest mb-6 text-zinc-600">Channel Nodes</h4>
              <div className="space-y-2">
                {Object.keys(groupedChats).map((uid) => (
                  <button 
                    key={uid}
                    onClick={() => setSelectedUserChat(uid)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all
                      ${selectedUserChat === uid ? 'bg-white text-black border-black shadow-brutal' : 'bg-zinc-900 border-white/5 hover:border-white/20 text-white'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center font-black text-xs">
                        {uid.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="font-display font-bold uppercase text-[10px] tracking-tight truncate">{uid}</p>
                        <p className={`text-[8px] font-mono truncate ${selectedUserChat === uid ? 'text-black/60' : 'text-zinc-600'}`}>
                          {groupedChats[uid][0].message}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col bg-zinc-950 border-4 border-black rounded-brutal shadow-brutal overflow-hidden">
              {selectedUserChat ? (
                <>
                  <div className="p-6 bg-zinc-900/50 border-b-2 border-black flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-black uppercase text-xl italic tracking-tighter leading-none mb-1">NODE_{selectedUserChat.substring(0, 8)}</h4>
                      <p className="text-[10px] font-black font-mono text-neon-green uppercase tracking-widest">Connection Stable</p>
                    </div>
                    <BrutalButton variant="outline" size="sm" onClick={() => setSelectedUserChat(null)}>
                      <X className="w-4 h-4" />
                    </BrutalButton>
                  </div>

                  <div className="flex-grow p-6 overflow-y-auto space-y-6 flex flex-col-reverse">
                    {groupedChats[selectedUserChat].map((chat) => (
                      <div 
                        key={chat.id}
                        className={`flex flex-col ${chat.sender === 'ADMIN' ? 'items-end' : 'items-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] p-4 rounded-2xl border-2 border-black shadow-brutal
                            ${chat.sender === 'ADMIN' ? 'bg-electric-purple text-white' : 'bg-white text-black'}
                          `}
                        >
                          <p className="text-sm font-bold leading-relaxed">{chat.message}</p>
                          <span className={`text-[8px] font-mono mt-2 block opacity-50 uppercase`}>
                            {chat.timestamp?.toDate().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-zinc-900/50 border-t-2 border-black">
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                        placeholder="Type encrypted reply..."
                        className="flex-grow bg-black border-2 border-white/5 rounded-xl px-4 text-xs font-bold font-mono tracking-tighter focus:border-neon-yellow transition-colors outline-none"
                      />
                      <BrutalButton variant="neon" onClick={handleSendReply}>
                        <Send className="w-5 h-5" />
                      </BrutalButton>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-20">
                  <MessageSquare className="w-20 h-20 text-zinc-900 mb-8" />
                  <h3 className="font-display font-black text-2xl uppercase italic tracking-tighter text-zinc-700 mb-2">Select a node</h3>
                  <p className="text-zinc-800 text-[10px] font-black uppercase tracking-widest font-mono">Awaiting support signal from operative...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
