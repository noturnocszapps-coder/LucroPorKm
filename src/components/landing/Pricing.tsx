import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star } from 'lucide-react';

export default function Pricing() {
  return (
    <section className="py-32 px-6 bg-zinc-900 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white uppercase italic">
            O investimento que se <span className="text-emerald-500">paga sozinho</span>
          </h2>
          <p className="text-gray-400 text-lg font-light">
             Menos que uma corrida ruim por mês para ter controle profissional dos seus ganhos.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-black rounded-[40px] p-10 border-2 border-emerald-500 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-6 right-6">
              <Star className="text-emerald-500 fill-emerald-500 animate-pulse" size={32} />
            </div>
            
            <div className="mb-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">Plano Motorista Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl font-bold italic">R$</span>
                <span className="text-7xl font-black text-white tracking-widest leading-none">9,90</span>
                <span className="text-gray-500 font-bold uppercase tracking-widest ml-2">/mês</span>
              </div>
            </div>

            <ul className="space-y-6 mb-12">
              <PricingItem text="Custo por KM em Tempo Real" />
              <PricingItem text="Provisionamento de Manutenção" />
              <PricingItem text="Metas e Objetivos de Lucro" />
              <PricingItem text="Gestão de Múltiplas Plataformas" />
              <PricingItem text="Relatórios Mensais" />
            </ul>

            <Link
              to="/register"
              className="block w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl text-center rounded-[24px] shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Começar agora
            </Link>
            
            <p className="text-center text-gray-600 text-[10px] mt-6 font-bold uppercase tracking-[0.2em]">
              Sem fidelidade — Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 group">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
        <Check size={14} className="text-emerald-500" />
      </div>
      <span className="text-gray-300 font-medium tracking-tight group-hover:text-white transition-colors">{text}</span>
    </li>
  );
}
