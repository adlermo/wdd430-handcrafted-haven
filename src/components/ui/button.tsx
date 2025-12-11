import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-terracotta text-white hover:bg-terracotta-600 focus-visible:ring-terracotta shadow-soft hover:shadow-soft-md':
              variant === 'primary',
            'bg-sage text-white hover:bg-sage-600 focus-visible:ring-sage shadow-soft hover:shadow-soft-md':
              variant === 'secondary',
            'border-2 border-terracotta text-terracotta hover:bg-terracotta-50 focus-visible:ring-terracotta':
              variant === 'outline',
            'text-charcoal-400 hover:bg-gray-100 focus-visible:ring-gray-400': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref as any}
        {...(props as any)}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };

