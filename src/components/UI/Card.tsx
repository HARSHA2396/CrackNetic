import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'gradient';
}

export function Card({ children, className = '', padding = 'md', variant = 'glass' }: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-gray-800 border-gray-700',
    glass: 'bg-white/5 backdrop-blur-xl border-white/10',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/10',
  };

  return (
    <div className={`${variantClasses[variant]} border rounded-2xl shadow-xl ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}