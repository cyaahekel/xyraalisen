import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BrutalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'neon' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export default function BrutalButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className,
  ...props 
}: BrutalButtonProps) {
  const variants = {
    primary: 'bg-white text-black hover:bg-zinc-200',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-600',
    outline: 'bg-transparent text-white border-white hover:bg-white/10',
    neon: 'bg-neon-yellow text-black hover:bg-white',
    danger: 'bg-electric-red text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <motion.button
      whileHover={{ y: -2, x: -2 }}
      whileTap={{ y: 0, x: 0 }}
      className={cn(
        'brutal-button active:shadow-none active:translate-x-0 active:translate-y-0',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
