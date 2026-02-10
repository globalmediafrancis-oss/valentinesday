
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white/40 backdrop-blur-sm border border-rose-100/50 rounded-lg shadow-sm p-8 relative overflow-hidden ${className}`}>
      {/* Subtle decorative frame corner */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-rose-200" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-rose-200" />
      {children}
    </div>
  );
};

export default Card;
