import React from 'react';
import { cn } from '../lib/utils';

export function Input({ label, error, prefix, suffix, className, ...props }: any) {
  return (
    <div className="w-full space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">
        {label}
      </label>
      <div className="relative group">
        {prefix && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
            {prefix}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-zinc-900/50 border border-white/5 rounded-[20px] px-5 py-4 text-sm transition-all outline-none",
            "focus:border-emerald-500/30 focus:bg-emerald-500/[0.03] text-white font-medium placeholder:text-gray-700",
            "group-hover:border-white/10",
            prefix && "pl-14",
            suffix && "pr-14",
            error && "border-red-500/30 focus:border-red-500/50 focus:bg-red-500/5",
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-black text-[10px] uppercase tracking-widest">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-[10px] font-black underline decoration-red-500/50 text-red-400 ml-1 uppercase italic tracking-widest mt-1">{error}</p>}
    </div>
  );
}

export function Button({ variant = 'primary', isLoading, className, children, ...props }: any) {
  const variants: any = {
    primary: 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.2)]',
    secondary: 'bg-white text-black hover:bg-gray-100',
    outline: 'bg-transparent border border-white/10 text-white hover:bg-white/5',
    ghost: 'bg-transparent text-gray-400 hover:text-white',
  };

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 px-8 py-5 rounded-[24px] font-black uppercase tracking-[0.15em] text-xs transition-all active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 italic",
        variants[variant],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
}

export function Select({ label, options, className, ...props }: any) {
  return (
    <div className="w-full space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 italic">
        {label}
      </label>
      <div className="relative group">
        <select
          className={cn(
            "w-full bg-zinc-900/50 border border-white/5 rounded-[20px] px-5 py-4 text-sm transition-all outline-none appearance-none cursor-pointer",
            "focus:border-emerald-500/30 focus:bg-emerald-500/[0.03] text-white font-medium",
            "group-hover:border-white/10",
            className
          )}
          {...props}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-emerald-500 transition-colors">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
