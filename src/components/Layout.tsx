import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import SupportChat from './SupportChat';
import { motion } from 'motion/react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-mesh overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <main className="relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <SupportChat />
      <Footer />
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.05),transparent_70%)]" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-electric-purple/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-neon-yellow/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
