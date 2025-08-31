import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ progress, className = '', showLabel = true }: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-3">
        {showLabel && (
          <span className="text-sm font-medium text-white">Progress</span>
        )}
        <span className="text-sm font-medium text-primary-400">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm border border-white/20">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}