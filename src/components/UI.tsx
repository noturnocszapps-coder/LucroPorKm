import React from 'react';
import { cn } from '../lib/utils';

export function Input({ label, error, prefix, suffix, className, ...props }: any) {
  return (
    <div className="w-full space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
        {label}
      </label>
      <div className="relative group">
        {prefix && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {prefix}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3.5 text-sm transition-all outline-none",
            "focus:border-emerald-500/50 focus:bg-emerald-500/5",
            prefix && "pl-12",
            suffix && "pr-12",
            error && "border-red-500/50 focus:border-red-500/50 focus:bg-red-500/5",
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-xs">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-[10px] font-medium text-red-400 ml-1 uppercase">{error}</p>}
    </div>
  );
}

export function Button({ variant = 'primary', isLoading, className, children, ...props }: any) {
  const variants: any = {
    primary: 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/10',
    secondary: 'bg-white text-black hover:bg-gray-200',
    outline: 'bg-transparent border border-white/10 text-white hover:bg-white/5',
    ghost: 'bg-transparent text-gray-400 hover:text-white',
  };

  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100",
        variants[variant],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

export function Select({ label, options, className, ...props }: any) {
  return (
    <div className="w-full space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          className={cn(
            "w-full bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3.5 text-sm transition-all outline-none appearance-none",
            "focus:border-emerald-500/50 focus:bg-emerald-500/5",
            className
          )}
          {...props}
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
