import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export default function Card({ title, children, className = '', hover = false, style }: CardProps) {
  return (
    <div 
      className={`
        bg-white rounded-3xl shadow-lg border border-emerald-100 p-6 sm:p-8 transition-all
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
      style={style}
    >
      {title && (
        <h2 className="text-2xl font-extrabold mb-6 text-emerald-900 flex items-center gap-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
