import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, ShieldAlert, Cpu } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import BrutalButton from './ui/BrutalButton';

export default function SupportChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !isOpen) return;
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'chats'));
    return () => unsubscribe();
  }, [user, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;
    try {
      await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        message: message,
        sender: 'USER',
        timestamp: serverTimestamp()
      });
      setMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chats');
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] bg-zinc-950 border-4 border-black rounded-brutal shadow-brutal overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-neon-yellow border-b-4 border-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-xl">
                  <Cpu className="text-neon-yellow w-4 h-4" />
                </div>
                <h3 className="font-display font-black text-black uppercase text-sm tracking-tighter">Support_Protocol</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-black hover:scale-110 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-zinc-900/50">
              <div className="p-3 bg-zinc-950 border-2 border-white/5 rounded-xl text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                <ShieldAlert className="w-3 h-3 text-neon-yellow" />
                ENCRYPTED P2P CHANNEL ESTABLISHED
              </div>
              
              {chats.map((chat) => (
                <div 
                  key={chat.id}
                  className={`flex flex-col ${chat.sender === 'USER' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl border-2 border-black
                    ${chat.sender === 'USER' ? 'bg-white text-black' : 'bg-neon-yellow text-black'}
                  `}>
                    <p className="text-xs font-bold leading-relaxed">{chat.message}</p>
                    <span className="text-[8px] font-mono mt-2 block opacity-50 font-black">
                      {chat.timestamp?.toDate().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t-4 border-black bg-zinc-950 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Request assist..."
                className="flex-grow bg-black border-2 border-white/10 rounded-xl px-4 py-2 text-xs font-bold font-mono focus:border-neon-yellow transition-colors outline-none"
              />
              <BrutalButton variant="neon" size="sm" type="submit">
                <Send className="w-4 h-4" />
              </BrutalButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full border-4 border-black shadow-brutal flex items-center justify-center transition-all hover:scale-110 active:scale-95
          ${isOpen ? 'bg-white text-black' : 'bg-neon-yellow text-black'}
        `}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
      </button>
    </div>
  );
}
