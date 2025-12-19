import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary',
  size = 'md',
  loading = false,
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white focus:ring-emerald-500',
    secondary: 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50 focus:ring-emerald-400',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white focus:ring-red-500',
    outline: 'border-2 border-emerald-600 text-emerald-700 bg-transparent hover:bg-emerald-50 focus:ring-emerald-500',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''} 
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span className="animate-spin rounded-full border-2 border-t-emerald-500 border-r-emerald-200 border-b-transparent border-l-transparent w-4 h-4 mr-2" />
      )}
      {children}
    </button>
  );
}
