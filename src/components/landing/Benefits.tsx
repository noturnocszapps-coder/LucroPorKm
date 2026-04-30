import React from 'react';
import { Target, ShieldCheck, Zap, History } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: <Target className="text-emerald-500" />,
      title: "Descubra custo por KM",
      desc: "Pare de olhar só o bruto. Entenda o que cada KM rodado tira do seu bolso."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" />,
      title: "Evite prejuízo",
      desc: "Identifique dias ruins e ajuste sua estratégia para rodar apenas quando vale a pena."
    },
    {
      icon: <Zap className="text-emerald-500" />,
      title: "Decida melhor as corridas",
      desc: "Com consciência dos seus custos, você escolhe apenas o que traz lucro real."
    },
    {
      icon: <History className="text-emerald-500" />,
      title: "Controle financeiro",
      desc: "Histórico completo para você saber exatamente quanto lucrou no fim do mês."
    }
  ];

  return (
    <section className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {benefits.map((b, idx) => (
            <div key={idx} className="flex gap-6 group">
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                <div className="group-hover:scale-110 transition-transform">{b.icon}</div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white uppercase tracking-tight italic group-hover:text-emerald-500 transition-colors">
                  {b.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-light">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
