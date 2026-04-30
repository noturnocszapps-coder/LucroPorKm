import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import Hero from '../components/landing/Hero';
import PainSection from '../components/landing/PainSection';
import ProofSection from '../components/landing/ProofSection';
import HowItWorks from '../components/landing/HowItWorks';
import Benefits from '../components/landing/Benefits';
import Pricing from '../components/landing/Pricing';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      <header className="fixed top-0 w-full z-[100] bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 transition-all duration-300">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-black tracking-tighter flex items-center gap-2 italic uppercase">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <TrendingUp size={18} className="text-black" />
            </div>
            <span>Lucro por KM</span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-xs font-bold uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2.5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-emerald-500 transition-all"
            >
              Começar
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <Hero />
        <PainSection />
        <ProofSection />
        <HowItWorks />
        <Benefits />
        <Pricing />
      </main>

      <footer className="py-20 px-6 bg-black border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-4">
            <div className="text-2xl font-black italic uppercase tracking-tighter flex items-center justify-center md:justify-start gap-2">
              <TrendingUp size={24} className="text-emerald-500" />
              <span>Lucro por KM</span>
            </div>
            <p className="text-gray-500 text-xs max-w-sm tracking-wide leading-relaxed font-light">
              Transformando a vida financeira de quem faz o Brasil rodar. Controle real para motoristas de aplicativo.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <p className="text-gray-500 text-[10px] tracking-[0.4em] uppercase font-bold">
              Desenvolvido por <span className="text-white">NT Aplicações</span>
            </p>
            <div className="flex gap-8 text-[9px] text-gray-700 uppercase tracking-[0.2em] font-bold">
              <span className="hover:text-emerald-500 cursor-pointer transition-colors">Termos de Uso</span>
              <span className="hover:text-emerald-500 cursor-pointer transition-colors">Privacidade</span>
              <span className="hover:text-emerald-500 cursor-pointer transition-colors">Suporte</span>
            </div>
          </div>
        </div>
        
        <div className="mt-20 border-t border-white/5 pt-8 text-center text-[9px] text-gray-800 uppercase tracking-widest font-medium">
          © {new Date().getFullYear()} Lucro por KM. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

