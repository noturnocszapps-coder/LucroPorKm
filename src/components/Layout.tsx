import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListPlus, Calculator, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="min-h-screen bg-black text-gray-100 pb-24 selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-lg font-semibold tracking-tight">
            {title || "Lucro por KM"}
          </h1>
          <div className="ml-auto flex items-center space-x-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-lg p-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-lg safe-bottom">
        <div className="container mx-auto max-w-lg flex items-center justify-around h-20 px-2">
          <NavItem to="/dashboard" icon={<Home size={22} />} label="Início" />
          <NavItem to="/entries" icon={<ListPlus size={22} />} label="Ganhos" />
          <NavItem to="/simulator" icon={<Calculator size={22} />} label="Simular" />
          <NavItem to="/reports" icon={<BarChart3 size={22} />} label="Relatórios" />
          <NavItem to="/settings" icon={<SettingsIcon size={22} />} label="Ajustes" />
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
        "flex flex-col items-center justify-center space-y-1 transition-all duration-200",
        isActive ? "text-emerald-500 scale-110" : "text-gray-500 hover:text-gray-300"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-tighter">{label}</span>
    </NavLink>
  );
}
