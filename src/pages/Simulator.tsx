import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Input, Button } from '../components/UI';
import { calculateDailyMetrics, getProfitMessage, calculateMonthlyFixedCosts, calculateMonthlyReserves } from '../lib/calculations';
import { formatCurrency, cn } from '../lib/utils';
import { Calculator, Target, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Simulator() {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    value: '',
    kmToPassenger: '',
    kmRide: ''
  });

  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (!profile) return;

    const totalKm = Number(formData.kmToPassenger) + Number(formData.kmRide);
    const grossRevenue = Number(formData.value);

    // Prorate fixed and maintenance costs per KM based on a monthly average (e.g., 4000km)
    const avgKmPerMonth = 4000; 
    
    // We sum all the new fixed cost components
    const monthlyFixedCosts = calculateMonthlyFixedCosts(profile as any);
    const monthlyReserves = calculateMonthlyReserves(profile as any);

    const fixedCostPerKm = monthlyFixedCosts / avgKmPerMonth;
    const maintenancePerKm = monthlyReserves / avgKmPerMonth;
    const fuelCostPerKm = profile.fuelPrice / profile.avgConsumption;

    const totalCostPerKm = fuelCostPerKm + fixedCostPerKm + maintenancePerKm;
    const totalCost = totalKm * totalCostPerKm;
    const netProfit = grossRevenue - totalCost;
    const profitPerKm = totalKm > 0 ? netProfit / totalKm : 0;

    setResult({
      totalKm,
      totalCost,
      netProfit,
      profitPerKm,
      status: getProfitMessage(profitPerKm)
    });
  };

  useEffect(() => {
    if (formData.value && (formData.kmToPassenger || formData.kmRide)) {
      calculate();
    } else {
      setResult(null);
    }
  }, [formData, profile]);

  return (
    <Layout title="Simular Corrida">
      <div className="space-y-10">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Inteligência Financeira</span>
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Vale a pena?</h2>
          </div>
          <div className="text-right">
             <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 text-emerald-500 shadow-xl">
                <Calculator size={24} />
             </div>
          </div>
        </header>

        <section className="bg-zinc-900 rounded-[40px] p-8 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
          
          <Input 
            label="Valor Bruto da Oferta" 
            placeholder="0,00" 
            prefix="R$"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            className="text-2xl font-black bg-black/40 italic"
          />
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <Input 
              label="Até o passageiro" 
              placeholder="0" 
              suffix="km"
              type="number"
              step="0.1"
              value={formData.kmToPassenger}
              onChange={(e) => setFormData(prev => ({ ...prev, kmToPassenger: e.target.value }))}
              className="bg-black/40"
            />
            <Input 
              label="Distância da Viagem" 
              placeholder="0" 
              suffix="km"
              type="number"
              step="0.1"
              value={formData.kmRide}
              onChange={(e) => setFormData(prev => ({ ...prev, kmRide: e.target.value }))}
              className="bg-black/40"
            />
          </div>
        </section>

        {result ? (
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Status Badge */}
            <div className={cn(
              "p-6 rounded-[32px] border-2 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] italic transition-all duration-500 shadow-2xl",
              result.profitPerKm >= 1.0 ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-emerald-500/10" :
              result.profitPerKm > 0 ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-500 shadow-yellow-500/10" :
              "bg-red-500/10 border-red-500/40 text-red-500 shadow-red-500/10"
            )}>
              {result.profitPerKm >= 1.0 ? <Zap size={22} className="animate-pulse" /> : <AlertCircle size={22} />}
              {result.status.text}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-5">
              <ResultItem 
                 label="Lucro Líquido" 
                 value={formatCurrency(result.netProfit)} 
                 highlighted={result.netProfit > 0} 
                 icon={<TrendingUp size={12} />}
              />
              <ResultItem 
                label="Lucro por KM" 
                value={formatCurrency(result.profitPerKm)} 
                highlighted={result.profitPerKm >= 1} 
                icon={<Gauge size={12} />}
              />
              <ResultItem 
                label="Custo da Viagem" 
                value={formatCurrency(result.totalCost)} 
                icon={<ArrowRight size={12} />}
              />
              <ResultItem 
                label="Total Rodado" 
                value={result.totalKm.toFixed(1) + ' km'} 
                icon={<Zap size={12} />}
              />
            </div>

            <div className="p-6 bg-zinc-900/50 rounded-[28px] border border-white/5">
               <p className="text-[10px] text-gray-500 text-center leading-relaxed italic font-medium">
                  Resultados baseados no seu perfil operacional: 
                  Fixo {formatCurrency(calculateMonthlyFixedCosts(profile as any) / 4000)}/km + 
                  Reservas {formatCurrency(calculateMonthlyReserves(profile as any) / 4000)}/km + 
                  Combustível {formatCurrency(profile.fuelPrice / profile.avgConsumption)}/km.
               </p>
            </div>
          </motion.section>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-80 flex flex-col items-center justify-center text-gray-700 bg-zinc-900/30 border-2 border-dashed border-white/5 rounded-[40px] px-10 text-center"
          >
            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5 scale-110">
               <Calculator size={40} className="opacity-20 translate-x-0.5 translate-y-0.5" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black italic">Aguardando dados</p>
            <p className="text-xs text-gray-600 mt-2 font-medium">Preencha os valores para uma análise profissional.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

function ResultItem({ label, value, highlighted, icon }: { label: string, value: string, highlighted?: boolean, icon?: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 rounded-[28px] p-6 border border-white/5 shadow-lg group">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("transition-colors", highlighted ? "text-emerald-500" : "text-gray-500")}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic">{label}</span>
      </div>
      <div className={cn("text-xl font-black italic tracking-tighter truncate", highlighted ? "text-emerald-400" : "text-gray-100 uppercase")}>{value}</div>
    </div>
  );
}
