import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { formatCurrency, cn } from '../lib/utils';
import { AlertTriangle, CheckCircle2, TrendingUp, Car } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    grossRevenue: 0,
    netProfit: 0,
    totalKm: 0,
    totalCost: 0,
    profitPerKm: 0,
    revenuePerKm: 0
  });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      const q = query(
        collection(db, 'profiles', user.uid, 'entries'),
        orderBy('date', 'desc'),
        limit(30) // Last 30 entries
      );

      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => doc.data());
      
      const sums = entries.reduce((acc, entry) => {
        acc.grossRevenue += entry.grossRevenue || 0;
        acc.totalKm += entry.totalKm || 0;
        acc.netProfit += entry.calculatedMetrics?.netProfit || 0;
        acc.totalCost += entry.calculatedMetrics?.totalCost || 0;
        return acc;
      }, { grossRevenue: 0, totalKm: 0, netProfit: 0, totalCost: 0 });

      setStats({
        ...sums,
        profitPerKm: sums.totalKm > 0 ? sums.netProfit / sums.totalKm : 0,
        revenuePerKm: sums.totalKm > 0 ? sums.grossRevenue / sums.totalKm : 0
      });
      setLoading(false);
    }

    fetchStats();
  }, [user]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-emerald-500 uppercase tracking-widest text-xs">Carregando dados...</div>;

  const minDailyFaturamento = profile ? (profile.fixedCostsMonthly + profile.maintenanceMonthly) / 30 : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome */}
        <section>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Visão Geral</span>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Olá, {user?.email?.split('@')[0]}
            <motion.div 
              animate={{ rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              👋
            </motion.div>
          </h2>
        </section>

        {/* Smart Alert */}
        <section>
          {stats.profitPerKm >= 1.0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-3xl flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1 shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-sm text-emerald-100">Hoje você está no lucro</h3>
                <p className="text-xs text-emerald-500/80 mt-1">Sua média de lucro por KM está excelente (R$ {stats.profitPerKm.toFixed(2)}). Continue assim!</p>
              </div>
            </div>
          ) : stats.totalKm > 0 ? (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-3xl flex items-start gap-3">
              <AlertTriangle className="text-yellow-500 mt-1 shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-sm text-yellow-100">Custo operacional alto</h3>
                <p className="text-xs text-yellow-500/80 mt-1">Seu lucro por KM está abaixo de R$ 1,00. Revise seus quilômetros voados ou consumo.</p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-white/5 p-4 rounded-3xl flex items-start gap-3">
              <TrendingUp className="text-emerald-500 mt-1 shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-sm text-gray-200">Defina sua meta</h3>
                <p className="text-xs text-gray-500 mt-1">Você precisa faturar pelo menos {formatCurrency(minDailyFaturamento)} por dia para cobrir custos fixos.</p>
              </div>
            </div>
          )}
        </section>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            label="Faturamento Mes" 
            value={formatCurrency(stats.grossRevenue)} 
            color="text-white"
          />
          <StatCard 
            label="Lucro Líquido" 
            value={formatCurrency(stats.netProfit)} 
            color="text-emerald-400"
          />
          <StatCard 
            label="KM Rodados" 
            value={stats.totalKm.toLocaleString() + ' km'} 
          />
          <StatCard 
            label="Custo Total" 
            value={formatCurrency(stats.totalCost)} 
            color="text-red-400"
          />
        </div>

        {/* Efficiency Stats */}
        <section className="bg-zinc-900 rounded-3xl p-6 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Eficiência</h3>
            <Car size={14} className="text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <EfficiencyRow 
              label="Lucro por KM" 
              value={formatCurrency(stats.profitPerKm)} 
              progress={(stats.profitPerKm / 2.5) * 100}
              color="bg-emerald-500"
            />
            <EfficiencyRow 
              label="Faturamento por KM" 
              value={formatCurrency(stats.revenuePerKm)} 
              progress={(stats.revenuePerKm / 5) * 100}
              color="bg-blue-500"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, color = "text-gray-100" }: { label: string, value: string, color?: string }) {
  return (
    <div className="bg-zinc-900 rounded-3xl p-5 border border-white/5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <div className={cn("text-lg font-bold mt-1 tracking-tight truncate", color)}>{value}</div>
    </div>
  );
}

function EfficiencyRow({ label, value, progress, color }: { label: string, value: string, progress: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}
