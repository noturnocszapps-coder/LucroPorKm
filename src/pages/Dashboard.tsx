import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { formatCurrency, cn } from '../lib/utils';
import { AlertTriangle, CheckCircle2, TrendingUp, Car } from 'lucide-react';
import { motion } from 'motion/react';

import { calculateMonthlyFixedCosts, calculateMonthlyReserves } from '../lib/calculations';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    grossRevenue: 0,
    netProfit: 0,
    totalKm: 0,
    totalCost: 0,
    profitPerKm: 0,
    revenuePerKm: 0,
    todayRevenue: 0,
    todayKm: 0
  });

  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        console.log('[DASHBOARD] No user for stats');
        return;
      }
      
      try {
        console.log('[DASHBOARD] Fetching entries...');
        const q = query(
          collection(db, 'profiles', user.uid, 'entries'),
          orderBy('date', 'desc'),
          limit(30)
        );

        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => doc.data());
        console.log(`[DASHBOARD] Found ${entries.length} entries`);
        
        const today = new Date().toISOString().split('T')[0];
        let todayRevenue = 0;
        let todayKm = 0;

        const sums = entries.reduce((acc, entry) => {
          acc.grossRevenue += entry.grossRevenue || 0;
          acc.totalKm += entry.totalKm || 0;
          acc.netProfit += entry.calculatedMetrics?.netProfit || 0;
          acc.totalCost += entry.calculatedMetrics?.totalCost || 0;
          
          if (entry.date === today) {
            todayRevenue += entry.grossRevenue || 0;
            todayKm += entry.totalKm || 0;
          }
          
          return acc;
        }, { grossRevenue: 0, totalKm: 0, netProfit: 0, totalCost: 0 });

        setStats({
          ...sums,
          todayRevenue,
          todayKm,
          profitPerKm: sums.totalKm > 0 ? sums.netProfit / sums.totalKm : 0,
          revenuePerKm: sums.totalKm > 0 ? sums.grossRevenue / sums.totalKm : 0
        });
      } catch (error) {
        console.error('[DASHBOARD] Error fetching stats:', error);
      } finally {
        setLoading(false);
        console.log('[DASHBOARD] Loading finished');
      }
    }

    fetchStats();
  }, [user]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-emerald-500 uppercase tracking-widest text-xs">Carregando dados...</div>;

  const monthlyFixedTotal = profile ? calculateMonthlyFixedCosts(profile as any) : 0;
  const monthlyReservesTotal = profile ? calculateMonthlyReserves(profile as any) : 0;
  // Fallback for old users who might still have the old consolidated fields
  const oldFixed = (profile?.fixedCostsMonthly || 0) + (profile?.maintenanceMonthly || 0);
  
  const minDailyFaturamento = (monthlyFixedTotal + monthlyReservesTotal) > 0 
    ? (monthlyFixedTotal + monthlyReservesTotal) / (profile?.daysWorkedPerMonth || 30) 
    : oldFixed / 30;

  // Real-time profit calculation for today
  const fuelPerKm = profile?.avgConsumption > 0 ? (profile?.fuelPrice || 0) / profile?.avgConsumption : 0;
  const todayFuelCost = stats.todayKm * fuelPerKm;
  const todayTotalCost = minDailyFaturamento + todayFuelCost;
  const todayNetProfit = stats.todayRevenue - todayTotalCost;
  
  // Daily Profit Goal (Base)
  const dailyProfitGoal = profile?.dailyProfitGoal || 150;
  const totalRevenueGoal = minDailyFaturamento + todayFuelCost + dailyProfitGoal;
  
  const progressPercent = Math.min(Math.round((stats.todayRevenue / (totalRevenueGoal || 1)) * 100), 100);

  return (
    <Layout>
      <div className="space-y-10">
        {/* Welcome */}
        <section className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[32px] border border-white/5 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">Performance</span>
            <h2 className="text-2xl font-black flex items-center gap-2 text-white italic tracking-tighter">
              Olá, {user?.email?.split('@')[0]}
              <motion.div 
                animate={{ rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                👋
              </motion.div>
            </h2>
          </div>
          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/10">
             <TrendingUp size={24} className="text-emerald-500" />
          </div>
        </section>

        {/* Smart Alert */}
        <section>
          {stats.profitPerKm >= 1.0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[28px] flex items-center gap-4 group">
              <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-black" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white uppercase tracking-tight italic">Operação Saudável</h3>
                <p className="text-xs text-emerald-500/70 font-medium tracking-tight mt-0.5">Sua margem de lucro está acima de R$ 1,00/KM. Parabéns!</p>
              </div>
            </div>
          ) : stats.totalKm > 0 ? (
            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-[28px] flex items-center gap-4 group">
                <div className="p-3 bg-red-500 rounded-2xl shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="text-black" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-tight italic">Alerta de Prejuízo</h3>
                  <p className="text-xs text-red-400/70 font-medium tracking-tight mt-0.5">Margem abaixo de R$ 1,00/KM. Cuidado com rodagens vazias.</p>
                </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-white/5 p-5 rounded-[28px] flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-2xl border border-white/10">
                <TrendingUp className="text-emerald-500" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-300 uppercase tracking-tight italic tracking-widest">Inicie seu turno</h3>
                <p className="text-xs text-gray-500 font-medium tracking-tight mt-0.5">Fature pelo menos {formatCurrency(minDailyFaturamento)} para cobrir custos.</p>
              </div>
            </div>
          )}
        </section>
        
        {/* Daily Goal Card */}
        <section className="bg-zinc-900 rounded-[40px] p-8 border-2 border-emerald-500/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-emerald-500/10 transition-colors" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1 italic">Meta Diária Bruta</h3>
                <p className="text-3xl font-black text-white italic tracking-tighter">{formatCurrency(totalRevenueGoal)}</p>
              </div>
              <div className="text-right space-y-1">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1 italic">Faturado Hoje</h3>
                <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">{formatCurrency(stats.todayRevenue)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Progresso</span>
                <span className="text-sm font-black text-white italic">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-black h-4 rounded-full overflow-hidden border border-white/5 p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "h-full rounded-full transition-all duration-700 relative",
                    stats.todayRevenue >= totalRevenueGoal ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  )}
                >
                   <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 uppercase font-black tracking-tighter italic">
                <span>Custos: {formatCurrency(todayTotalCost)}</span>
                <span className="text-emerald-500/70">Lucro Alvo: {formatCurrency(dailyProfitGoal)}</span>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                 <div className={cn("px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest", todayNetProfit > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-400")}>
                   {todayNetProfit > 0 ? "Lucro Real" : "Em Busca do Lucro"}
                 </div>
                 <p className="text-[11px] text-white font-bold tracking-tight">
                    {todayNetProfit >= dailyProfitGoal 
                      ? "Meta batida! Você é um motorista elite. 🚀" 
                      : todayNetProfit > 0 
                        ? `Faltam R$ ${Math.max(dailyProfitGoal - todayNetProfit, 0).toFixed(2)} para o lucro alvo.`
                        : `Vá fundo! R$ ${Math.abs(todayNetProfit).toFixed(2)} para pagar os custos de hoje.`}
                 </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Stats Title */}
        <section className="flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-white/5" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic">Resumo Mensal</span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </section>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-5">
          <StatCard 
            label="Faturamento" 
            value={formatCurrency(stats.grossRevenue)} 
            color="text-white"
            icon={<CircleDollarSign size={14} className="text-blue-500" />}
          />
          <StatCard 
            label="Lucro Líquido" 
            value={formatCurrency(stats.netProfit)} 
            color="text-emerald-400"
            icon={<TrendingUp size={14} className="text-emerald-500" />}
          />
          <StatCard 
            label="Kilometragem" 
            value={stats.totalKm.toLocaleString() + ' km'} 
            icon={<Gauge size={14} className="text-gray-500" />}
          />
          <StatCard 
            label="Despesas" 
            value={formatCurrency(stats.totalCost)} 
            color="text-red-400"
            icon={<AlertTriangle size={14} className="text-red-500" />}
          />
        </div>

        {/* Efficiency Stats */}
        <section className="bg-zinc-900 rounded-[32px] p-8 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -ml-16 -mb-16" />
          
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 italic">Eficiência Operacional</h3>
            <div className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-bold text-gray-400 border border-white/5">
              Últimos 30 dias
            </div>
          </div>
          
          <div className="space-y-8 relative z-10">
            <EfficiencyRow 
              label="Lucro / KM" 
              value={formatCurrency(stats.profitPerKm)} 
              progress={(stats.profitPerKm / 2.5) * 100}
              color="bg-emerald-500"
              subValue="Ideal acima de R$ 1,50"
            />
            <EfficiencyRow 
              label="Faturamento / KM" 
              value={formatCurrency(stats.revenuePerKm)} 
              progress={(stats.revenuePerKm / 5) * 100}
              color="bg-blue-500"
              subValue="Ideal acima de R$ 2,50"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, color = "text-gray-100", icon }: { label: string, value: string, color?: string, icon?: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 rounded-[28px] p-6 border border-white/5 hover:border-white/10 transition-colors group">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic">{label}</span>
      </div>
      <div className={cn("text-xl font-black tracking-tighter truncate italic", color)}>{value}</div>
    </div>
  );
}

function EfficiencyRow({ label, value, progress, color, subValue }: { label: string, value: string, progress: number, color: string, subValue?: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-tight">{label}</span>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{subValue}</p>
        </div>
        <span className="text-lg font-black text-white italic tracking-tighter">{value}</span>
      </div>
      <div className="w-full bg-black h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
