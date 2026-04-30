import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListPlus, Calculator, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 pb-24 selection:bg-emerald-500/30 font-sans">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[60] w-full border-b border-white/5 bg-[#0f0f0f]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center rotate-3 shadow-[0_5px_15px_rgba(16,185,129,0.3)]">
               <BarChart3 size={20} className="text-black" />
             </div>
             <div className="flex flex-col">
               <h1 className="text-xs font-black uppercase tracking-[0.2em] italic text-white leading-none">
                 {title || "Lucro por KM"}
               </h1>
               <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">SaaS de Alta Performance</span>
             </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="group relative">
               <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full group-hover:blur-lg transition-all" />
               <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black italic relative z-10 text-emerald-500">
                 NT
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-lg p-6 relative z-10">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[70] border-t border-white/5 bg-[#0f0f0f]/90 backdrop-blur-2xl safe-bottom">
        <div className="container mx-auto max-w-lg flex items-center justify-around h-20 px-4">
          <NavItem to="/dashboard" icon={<Home size={20} />} label="Home" />
          <NavItem to="/entries" icon={<ListPlus size={20} />} label="Ganhos" />
          <NavItem to="/simulator" icon={<Calculator size={20} />} label="Simular" />
          <NavItem to="/reports" icon={<BarChart3 size={20} />} label="Relatórios" />
          <NavItem to="/settings" icon={<SettingsIcon size={20} />} label="Conta" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex flex-col items-center justify-center space-y-1 transition-all duration-300 w-16 relative",
        isActive ? "text-emerald-500" : "text-zinc-600 hover:text-zinc-400"
      )}
    >
      {({ isActive }) => (
        <>
          <div className={cn("transition-transform duration-500", isActive ? "scale-110 -translate-y-1" : "scale-100")}>
            {icon}
          </div>
          <span className={cn("text-[9px] font-black uppercase tracking-[0.1em] italic transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}>{label}</span>
          {isActive && (
            <motion.div 
               layoutId="nav-glow"
               className="absolute -top-12 w-12 h-12 bg-emerald-500/10 blur-xl rounded-full" 
            />
          )}
        </>
      )}
    </NavLink>
  );
}
