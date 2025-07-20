
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon, footer }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-xl border border-brand-border rounded-2xl shadow-2xl hover:shadow-brand-accent/30 transition-shadow duration-300 ${className}`} style={{ boxShadow: '0 8px 32px 0 rgba(99,102,241,0.15)' }}>
        {title && (
            <div className="p-4 border-b border-brand-border flex items-center gap-3 bg-white/5 rounded-t-2xl">
                {icon}
                <h3 className="text-lg font-semibold text-brand-text tracking-tight drop-shadow-sm">{title}</h3>
            </div>
        )}
      <div className="p-4 md:p-6">{children}</div>
      {footer && (
        <div className="p-4 border-t border-brand-border bg-black/20 rounded-b-2xl">
            {footer}
        </div>
      )}
    </div>
  );
};
