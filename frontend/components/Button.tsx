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
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg focus:ring-emerald-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-400',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md hover:shadow-lg focus:ring-red-500',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500',
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
        <span className="spinner mr-2" />
      )}
      {children}
    </button>
  );
}
