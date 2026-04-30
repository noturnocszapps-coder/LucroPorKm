import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Fuel, TrendingUp, ShieldCheck, Wallet, Coffee, Calculator, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      <header className="absolute top-0 w-full z-50 py-6 px-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-black" />
            </div>
            <span>Lucro por KM</span>
          </div>
          <Link to="/login" className="text-sm font-semibold hover:text-emerald-500 transition-colors">
            Entrar
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-32 px-6 overflow-hidden">
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
                NT Aplicações — Software para Motoristas
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                Você sabe quanto <span className="text-emerald-500">realmente lucra</span> por corrida?
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Descubra seu lucro real como motorista de aplicativo. Controle seu faturamento, combustível e manutenção sem complicação.
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                >
                  Começar a Lucrar Agora
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-2 sm:mt-0 font-medium">
                  Ideal para Uber, 99 e inDrive
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dor Section - SEO Focused */}
        <section className="bg-zinc-900 py-24 px-6 border-y border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Você pode estar trabalhando no prejuízo sem saber
            </h2>
            <p className="text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
              Rodar por aplicativo não é só encher o tanque e dirigir. Se você não calcula seu <span className="text-white font-semibold">custo por KM uber</span> corretamente, o seu lucro pode ser uma ilusão.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <FeatureCard 
                icon={<Fuel className="text-emerald-500" />}
                title="Combustível"
                description="O maior vilão do seu bolso. Saiba exatamente qual o impacto do combustível no seu lucro uber."
              />
              <FeatureCard 
                icon={<ShieldCheck className="text-emerald-500" />}
                title="Custo do Carro Uber"
                description="Pneus, óleo e revisões. Provisione a manutenção automaticamente e ganhe tranquilidade."
              />
              <FeatureCard 
                icon={<Wallet className="text-emerald-500" />}
                title="Lucro Real Motorista"
                description="Descubra quanto ganha uber após descontar o aluguel, seguro e depreciação do veículo."
              />
            </div>
          </div>
        </section>

        {/* Explicação Section */}
        <section className="py-24 px-6 bg-black relative">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Como calcular lucro por km de forma profissional?</h2>
              <div className="space-y-6 text-gray-400 leading-relaxed font-light">
                <p>
                  Para ter um <span className="text-white font-medium">lucro motorista de aplicativo</span> saudável, você precisa somar todos os seus gastos fixos e variáveis e dividir pelo total de KMs rodados.
                </p>
                <p>
                  Parece difícil? O <span className="text-emerald-500 font-semibold italic">Lucro por KM</span> faz todo o trabalho pesado para você em segundos, direto no seu celular.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                  ))}
                </div>
                <div className="text-xs text-emerald-500 font-bold uppercase tracking-widest">+500 motoristas controlados</div>
              </div>
            </div>
            <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 relative group">
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="text-xs text-emerald-500 font-bold mb-4 uppercase tracking-widest">Exemplo Real</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-400">Total Bruto</span>
                    <span className="font-bold text-white">R$ 350,00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-400">Combustível</span>
                    <span className="font-bold text-red-400">- R$ 120,00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-400">Custos Variáveis</span>
                    <span className="font-bold text-red-400">- R$ 45,00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-emerald-500 font-bold">LUCRO LÍQUIDO</span>
                    <span className="font-black text-xl text-emerald-500">R$ 185,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-24 px-6 bg-zinc-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Simples e Rápido</h2>
              <p className="text-gray-400">Pare de brigar com planilhas complexas. Veja como funciona:</p>
            </div>

            <div className="space-y-12">
              <Step 
                number="01"
                title="Cadastre seu veículo e custos"
                description="Informe o consumo do seu carro e seus custos fixos mensais para um cálculo preciso de custo carro aplicativo."
              />
              <Step 
                number="02"
                title="Lance seus ganhos diários"
                description="Ao fim do turno, leve apenas 30 segundos para lançar quanto faturou nas plataformas de aplicativo."
              />
              <Step 
                number="03"
                title="Analise seu lucro real corrida"
                description="Acompanhe gráficos de desempenho e descubra se suas metas financeiras estão sendo atingidas."
              />
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-24 px-6 bg-black">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            {[
              { title: "Dashboard Inteligente", desc: "Visualize tudo em um só lugar com gráficos intuitivos." },
              { title: "Cálculo Automático", desc: "Nós fazemos a matemática do seu lucro por km para você." },
              { title: "Foco no Motorista", desc: "Feito por quem entende a rotina pesada do asfalto brasileiro." },
              { title: "Acesso de Qualquer Lugar", desc: "WebApp leve e rápido, otimizado para o seu celular." }
            ].map((b, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-400 font-light">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Preço Section */}
        <section className="py-24 px-6 bg-zinc-900 border-t border-white/5">
          <div className="max-w-md mx-auto bg-black p-10 rounded-3xl border border-emerald-500/30 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest mt-4 mr-[-28px] rotate-45">
              Melhor Custo-Benefício
            </div>
            <h3 className="text-xl font-semibold mb-2">Plano Motorista Pro</h3>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-gray-400 text-lg">R$</span>
              <span className="text-5xl font-bold">9,90</span>
              <span className="text-gray-400">/mês</span>
            </div>
            <p className="text-gray-400 text-sm mb-8 flex items-center justify-center gap-2">
              <Coffee size={14} className="text-emerald-500" />
              Menos que um café para ter controle total do seu lucro.
            </p>
            <ul className="text-left space-y-4 mb-10 text-sm">
              <li className="flex items-center gap-3">
                <TrendingUp size={16} className="text-emerald-500" /> Dashboard de Performance
              </li>
              <li className="flex items-center gap-3">
                <Calculator size={16} className="text-emerald-500" /> Simulador de Corridas Uber
              </li>
              <li className="flex items-center gap-3">
                <BarChart3 size={16} className="text-emerald-500" /> Relatórios de Lucro Real KM
              </li>
              <li className="flex items-center gap-3 opacity-50">
                <ShieldCheck size={16} className="text-emerald-500" /> Sem compromisso (cancele quando quiser)
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
      </main>

      <footer className="py-12 px-6 bg-black border-t border-white/10 text-center">
        <div className="mb-6 opacity-30 invert">
          <TrendingUp size={24} className="mx-auto" />
        </div>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Lucro por KM — by <span className="text-white font-semibold">NT Aplicações</span>
        </p>
        <p className="text-gray-600 text-[10px] mt-4 font-medium uppercase tracking-tighter">
          Apoiando o motorista de aplicativo em Presidente Prudente e todo o Brasil.
        </p>
        <div className="mt-8 text-[9px] text-gray-700 uppercase tracking-widest flex justify-center gap-6">
          <span>Termos de Uso</span>
          <span>Privacidade</span>
        </div>
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
