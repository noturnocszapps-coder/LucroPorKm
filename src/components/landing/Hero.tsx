import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              O App nº1 do Motorista Premium
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.05] text-white">
              Você sabe quanto <span className="text-emerald-500">realmente sobra</span> no seu bolso?
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed font-light max-w-xl">
              Pare de rodar no escuro. Descubra seu lucro real por KM e evite corridas que dão prejuízo.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                to="/register"
                className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group"
              >
                Descobrir meu lucro agora
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex flex-col items-start gap-1">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                  +1.200 motoristas ativos
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            {/* Phone Mockup Frame */}
            <div className="relative mx-auto border-gray-800 bg-gray-900 border-[14px] rounded-[3.5rem] h-[600px] w-[300px] shadow-2xl">
              <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
              
              <div className="rounded-[2.5rem] overflow-hidden w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl animate-pulse" />
                </div>
                <div className="w-full space-y-4">
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mx-auto" />
                  <div className="h-24 bg-zinc-900 rounded-2xl border border-white/5" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-zinc-900 rounded-2xl border border-white/5" />
                    <div className="h-16 bg-zinc-900 rounded-2xl border border-white/5" />
                  </div>
                </div>
                <div className="mt-auto w-full py-4 text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">
                   Calculando Lucro Real...
                </div>
              </div>
            </div>
            
            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-12 bg-zinc-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl"
            >
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Lucro por KM</div>
              <div className="text-xl font-black text-emerald-500">R$ 1,84</div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 -right-8 bg-zinc-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl"
            >
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Combustível Hoje</div>
              <div className="text-xl font-black text-red-400">- R$ 124,50</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
