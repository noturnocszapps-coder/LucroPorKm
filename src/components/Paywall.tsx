import React from 'react';
import { motion } from 'motion/react';
import { Lock, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Paywall() {
  return (
    <div className="relative">
      {/* Blurred overlay for content behind */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 rounded-[32px] flex items-center justify-center border border-white/5">
        <div className="max-w-sm w-full mx-auto p-8 bg-[#1a1a1a] rounded-[40px] border-2 border-emerald-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <Star className="text-emerald-500 fill-emerald-500" size={24} />
          </div>
          
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <Lock className="text-emerald-500" size={24} />
          </div>

          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Desbloqueie seu lucro real</h3>
          <p className="text-gray-400 text-sm font-light mb-8 italic">
            "Menos que uma corrida ruim por mês"
          </p>

          <div className="space-y-4 mb-10 text-left">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={12} className="text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Histórico Completo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={12} className="text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Relatórios de Performance</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={12} className="text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Metas e Comparativos</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-white font-bold italic">R$</span>
              <span className="text-5xl font-black text-white tracking-widest">9,90</span>
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">/mês</span>
            </div>
          </div>

          <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.3)]">
            Desbloquear agora
          </button>
          
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-4">
            Acesso Instantâneo • Cancele quando quiser
          </p>
        </div>
      </div>
      
      {/* Skeleton Content to see behind the blur */}
      <div className="p-8 space-y-6 opacity-20 pointer-events-none">
        <div className="h-8 bg-zinc-800 rounded-lg w-1/3" />
        <div className="h-32 bg-zinc-900 rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-zinc-900 rounded-3xl" />
          <div className="h-24 bg-zinc-900 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
