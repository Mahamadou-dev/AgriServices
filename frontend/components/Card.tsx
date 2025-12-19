import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ title, children, className = '', hover = false }: CardProps) {
  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-gray-100 p-6
      ${hover ? 'card-hover cursor-pointer' : ''}
      ${className}
    `}>
      {title && (
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
