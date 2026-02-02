
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  error?: string;
  as?: 'input' | 'select';
  children?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  error, 
  as = 'input', 
  children, 
  className = '', 
  ...props 
}) => {
  const Component = as as any;
  
  return (
    <div className={`relative flex flex-col ${className}`}>
      <div className={`relative border-2 rounded-lg transition-all duration-200 group 
        ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus-within:border-sky-400 bg-white'}`}>
        
        <label className={`absolute left-3 -top-2.5 px-1 bg-white text-xs font-medium transition-all
          ${error ? 'text-red-500' : 'text-slate-500 group-focus-within:text-sky-500'}`}>
          {label}
        </label>

        <Component
          className={`w-full px-4 py-3 bg-transparent outline-none text-slate-800 placeholder:text-slate-300 transition-colors
            ${as === 'select' ? 'appearance-none cursor-pointer' : ''}`}
          {...props}
        >
          {children}
        </Component>

        {as === 'select' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
      {error && <span className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{error}</span>}
    </div>
  );
};
