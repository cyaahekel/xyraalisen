import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BrutalCardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export default function BrutalCard({ children, className, glow = false, ...props }: BrutalCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, x: -4 }}
      className={cn(
        'brutal-card p-6 overflow-hidden relative group',
        glow && 'hover:shadow-neon',
        className
      )}
      {...props}
    >
      {/* Decorative patterns */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
