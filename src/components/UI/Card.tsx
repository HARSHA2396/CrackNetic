import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'gradient' | 'solid';
  hover?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  padding = 'md', 
  variant = 'glass',
  hover = false 
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-slate-800/80 border-slate-700/50',
    glass: 'bg-white/5 backdrop-blur-xl border-white/10',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/10',
    solid: 'bg-slate-800 border-slate-700',
  };

  const hoverClasses = hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300' : '';

  return (
    <div className={`${variantClasses[variant]} border rounded-2xl shadow-xl ${paddingClasses[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}