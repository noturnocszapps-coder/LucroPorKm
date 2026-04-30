import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Input, Button } from '../components/UI';
import { calculateDailyMetrics, getProfitMessage } from '../lib/calculations';
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

    // Using daily formula but adjusted for a single trip
    // Custo fixo e manutenção são prorateados por KM baseado na média de 100km/dia se não soubermos melhor
    // Mas o usuário pediu custo fixo diário / 30.
    // Para simplificar o simulador, vamos usar o custo operacional por KM (combustível + (fixo/km_medio) + (manu/km_medio))
    // Vamos assumir uma média de 5000km/mês para calcular o custo fixo por KM se não houver um dado real.
    
    const avgKmPerMonth = 4000; 
    const fixedCostPerKm = profile.fixedCostsMonthly / avgKmPerMonth;
    const maintenancePerKm = profile.maintenanceMonthly / avgKmPerMonth;
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
      <div className="space-y-6">
        <header>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Simulador Financeiro</p>
          <h2 className="text-xl font-bold">Vale a pena aceitar?</h2>
        </header>

        <section className="bg-zinc-900 p-6 rounded-3xl border border-white/5 space-y-6">
          <Input 
            label="Valor da Corrida" 
            placeholder="0,00" 
            prefix="R$"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="KM até passageiro" 
              placeholder="0" 
              suffix="km"
              type="number"
              step="0.1"
              value={formData.kmToPassenger}
              onChange={(e) => setFormData(prev => ({ ...prev, kmToPassenger: e.target.value }))}
            />
            <Input 
              label="KM da corrida" 
              placeholder="0" 
              suffix="km"
              type="number"
              step="0.1"
              value={formData.kmRide}
              onChange={(e) => setFormData(prev => ({ ...prev, kmRide: e.target.value }))}
            />
          </div>
        </section>

        {result ? (
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Status Badge */}
            <div className={cn(
              "p-4 rounded-3xl border flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest",
              result.profitPerKm >= 1.0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
              result.profitPerKm > 0 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
              "bg-red-500/10 border-red-500/20 text-red-500"
            )}>
              {result.profitPerKm >= 1.0 ? <Zap size={18} /> : <AlertCircle size={18} />}
              {result.status.text}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4">
              <ResultItem label="Lucro Real" value={formatCurrency(result.netProfit)} highlighted={result.netProfit > 0} />
              <ResultItem label="Lucro por KM" value={formatCurrency(result.profitPerKm)} highlighted={result.profitPerKm >= 1} />
              <ResultItem label="Custo Estimado" value={formatCurrency(result.totalCost)} />
              <ResultItem label="Distância Total" value={result.totalKm.toFixed(1) + ' km'} />
            </div>

            <p className="text-[10px] text-gray-500 text-center px-6 leading-relaxed italic">
              * Estimativa baseada no seu custo operacional configurado e prorrogação de custos fixos por KM rodado.
            </p>
          </motion.section>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-3xl">
            <Calculator size={48} className="mb-4 opacity-20" />
            <p className="text-xs uppercase tracking-widest font-bold">Preencha os dados acima</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

function ResultItem({ label, value, highlighted }: { label: string, value: string, highlighted?: boolean }) {
  return (
    <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <div className={cn("text-lg font-bold mt-0.5", highlighted ? "text-emerald-400" : "text-gray-100")}>{value}</div>
    </div>
  );
}
