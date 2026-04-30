import React from 'react';
import { AlertTriangle, Fuel, ShieldX, Wallet } from 'lucide-react';

export default function PainSection() {
  return (
    <section className="bg-zinc-900/50 py-32 px-6 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white uppercase italic">
            Você pode estar <span className="text-red-500">trabalhando de graça</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">
            O faturamento bruto é uma ilusão. Sem controle, você paga para trabalhar e só percebe quando o carro quebra.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <PainCard 
            icon={<AlertTriangle className="text-red-500" />}
            title="Olha só o valor da corrida"
            description="Você aceita a corrida pelo valor total, mas esquece que o KM é baixo demais para pagar o custo."
          />
          <PainCard 
            icon={<Fuel className="text-red-500" />}
            title="Esquece o combustível"
            description="O valor na bomba sobe, mas sua percepção do lucro continua a mesma de meses atrás."
          />
          <PainCard 
            icon={<ShieldX className="text-red-500" />}
            title="Ignora a manutenção"
            description="O carro deprecia a cada KM. Se você não reserva dinheiro hoje, não terá carro amanhã."
          />
          <PainCard 
            icon={<Wallet className="text-red-500" />}
            title="Não sabe o lucro real"
            description="No fim do dia o saldo é positivo, mas no fim do mês as contas não fecham. Onde foi parar o dinheiro?"
          />
        </div>
      </div>
    </section>
  );
}

function PainCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-black/40 rounded-3xl border border-white/5 hover:border-red-500/20 transition-all duration-500 group">
      <div className="mb-6 p-4 rounded-2xl bg-zinc-900 border border-white/5 inline-block group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-tight">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
