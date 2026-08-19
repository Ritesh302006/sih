import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'red' | 'blue' | 'purple' | 'green' | 'orange' | 'yellow' | 'none';
}

export function Card({ className, glow = 'none', children, ...props }: CardProps) {
  const glowClasses = {
    none: 'border-slate-800',
    red: 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    blue: 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    purple: 'border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    green: 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    orange: 'border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    yellow: 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]',
  };

  return (
    <div
      className={cn(
        'bg-slate-950/40 backdrop-blur-md border rounded-xl overflow-hidden',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-4 border-b border-slate-800', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-semibold text-lg text-slate-100', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
}
