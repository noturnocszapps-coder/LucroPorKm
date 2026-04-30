import React from 'react';
import { Car, Smartphone, PieChart } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white uppercase italic">
            Como funciona
          </h2>
          <p className="text-gray-400 text-xl font-light">3 passos para assumir o controle total.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0" />
          
          <Step 
            number="01"
            icon={<Car size={24} />}
            title="Cadastre seu carro"
            description="Informe o consumo médio e combustível do seu veículo uma única vez."
          />
          <Step 
            number="02"
            icon={<Smartphone size={24} />}
            title="Lance seus ganhos"
            description="Ao finalizar o dia, leve 30 segundos para lançar km e faturamento."
          />
          <Step 
            number="03"
            icon={<PieChart size={24} />}
            title="Veja seu lucro real"
            description="Nós calculamos tudo e mostramos quanto sobrou livre de despesas."
          />
        </div>
      </div>
    </section>
  );
}

function Step({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center group">
      <div className="w-24 h-24 rounded-[32px] bg-zinc-900 border border-white/5 flex items-center justify-center mb-8 relative group-hover:border-emerald-500/30 transition-all duration-500 shadow-2xl">
        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-sm z-20">
          {number}
        </div>
        <div className="text-emerald-500 group-hover:scale-125 transition-transform duration-500">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-tight italic">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-light px-4">{description}</p>
    </div>
  );
}
