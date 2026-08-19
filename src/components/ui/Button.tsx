import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-purple-600 text-white hover:bg-purple-500 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
      secondary: 'bg-blue-600 text-white hover:bg-blue-500 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
      outline: 'bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white',
      ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white',
      danger: 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/40 hover:text-red-300',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-8 text-lg',
      icon: 'h-10 w-10 flex items-center justify-center p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
