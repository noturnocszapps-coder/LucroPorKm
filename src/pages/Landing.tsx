import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Fuel, TrendingUp, ShieldCheck, Wallet, Coffee, Calculator, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        {/* Abstract backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
              NT Aplicações — Lucro por KM
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Você sabe quanto <br />
              <span className="text-emerald-500">realmente lucra</span> por KM?
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Fugir das planilhas nunca foi tão fácil. Controle seus ganhos, custos e lucro líquido com a ferramenta feita por quem entende o motorista brasileiro.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
              >
                Começar Agora
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all border border-white/10"
              >
                Entrar na conta
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dores Section */}
      <section className="bg-zinc-900 py-24 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 tracking-tight">
            Você roda muito, fatura bem, mas no fim do mês o <span className="text-red-400 underline decoration-red-400/30 underline-offset-8">dinheiro some?</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <FeatureCard 
              icon={<Fuel className="text-emerald-500" />}
              title="Combustível"
              description="Saiba exatamente quanto do seu faturamento está ficando no posto."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" />}
              title="Reserva de Manutenção"
              description="Não seja pego de surpresa. Provisione pneus, óleo e revisões automaticamente."
            />
            <FeatureCard 
              icon={<Wallet className="text-emerald-500" />}
              title="Lucro Líquido Real"
              description="Descubra o que de fato sobra no seu bolso após todos os custos."
            />
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-gray-400">Três passos para o controle total do seu financeiro.</p>
          </div>

          <div className="space-y-12">
            <Step 
              number="01"
              title="Cadastre seu veículo e custos"
              description="Informe o consumo, preço do combustível e seus custos mensais (seguro, aluguel, internet)."
            />
            <Step 
              number="02"
              title="Lance ganhos e KM"
              description="Ao final do dia, gaste menos de 1 minuto para lançar quanto faturou e quanto rodou."
            />
            <Step 
              number="03"
              title="Visualize seus resultados"
              description="Acompanhe lucro por KM, metas diárias e relatórios detalhados para tomar decisões melhores."
            />
          </div>
        </div>
      </section>

      {/* Preço Section */}
      <section className="py-24 px-6 bg-zinc-900 border-t border-white/5">
        <div className="max-w-md mx-auto bg-black p-10 rounded-3xl border border-emerald-500/30 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest mt-4 mr-[-28px] rotate-45">
            Oferta MVP
          </div>
          <h3 className="text-xl font-semibold mb-2">Plano Motorista</h3>
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-gray-400 text-lg">R$</span>
            <span className="text-5xl font-bold">9,90</span>
            <span className="text-gray-400">/mês</span>
          </div>
          <p className="text-gray-400 text-sm mb-8 flex items-center justify-center gap-2">
            <Coffee size={14} className="text-emerald-500" />
            Menos que um café por semana para saber se você está lucrando.
          </p>
          <ul className="text-left space-y-4 mb-10 text-sm">
            <li className="flex items-center gap-3">
              <TrendingUp size={16} className="text-emerald-500" /> Dashboard Completo
            </li>
            <li className="flex items-center gap-3">
              <Calculator size={16} className="text-emerald-500" /> Simulador de Corridas
            </li>
            <li className="flex items-center gap-3">
              <BarChart3 size={16} className="text-emerald-500" /> Relatórios de Lucro Real
            </li>
          </ul>
          <Link
            to="/register"
            className="block w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all"
          >
            Começar Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-white/10 text-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Lucro por KM — by <span className="text-white font-semibold">NT Aplicações</span>
        </p>
        <p className="text-gray-600 text-[10px] mt-4">
          Presidente Prudente e Região. 2026.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-black rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group">
      <div className="mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-8 items-start">
      <div className="text-5xl font-black text-white/10 font-mono leading-none">{number}</div>
      <div>
        <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-light">{description}</p>
      </div>
    </div>
  );
}
