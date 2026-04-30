import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export default function ProofSection() {
  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-white">
              Resultados de quem sabe <span className="text-emerald-500 italic">fazer conta</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4 p-6 rounded-3xl bg-zinc-900/50 border border-white/5">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Visão Profissional</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Motoristas que usam o Lucro por KM aumentam sua percepção de lucro em até 35% ao rejeitar corridas de baixo rendimento.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-3xl bg-zinc-900/50 border border-white/5">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Controle de Gastos</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Saiba exatamente quanto custa cada KM rodado, incluindo IPVA, seguro, pneus e combustível.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* The Real Example Card */}
            <div className="bg-zinc-900 rounded-[40px] p-10 border border-white/10 shadow-2xl relative z-10 overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full -mr-20 -mt-20" />
               
               <div className="mb-10">
                 <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.3em] mb-4">Caso Real</h3>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-white font-bold font-mono">Turno de 10 Horas</span>
                 </div>
               </div>

               <div className="space-y-8">
                 <div className="flex justify-between items-end border-b border-white/5 pb-4">
                   <div className="space-y-1">
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Distância Rodada</p>
                     <p className="text-2xl font-black text-white">200.4 <span className="text-xs font-normal text-gray-500 uppercase tracking-tighter">km</span></p>
                   </div>
                   <div className="text-right space-y-1">
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Faturamento Bruto</p>
                     <p className="text-2xl font-black text-white">R$ 384,50</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 py-4 border-b border-white/5">
                   <div className="space-y-1">
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Combustível</p>
                     <p className="text-lg font-bold text-red-500">- R$ 138,20</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Manutenção (Prov.)</p>
                     <p className="text-lg font-bold text-red-500">- R$ 24,00</p>
                   </div>
                 </div>

                 <div className="pt-4 flex justify-between items-center bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10">
                   <p className="text-emerald-500 font-black uppercase tracking-[0.2em]">Lucro Real</p>
                   <div className="text-right">
                     <p className="text-3xl font-black text-emerald-500 leading-none">R$ 222,30</p>
                     <p className="text-[10px] text-emerald-500/50 font-bold uppercase mt-1">Líquido no bolso</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full z-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
