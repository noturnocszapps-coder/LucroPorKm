import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Share2, Calendar, TrendingUp, Trophy } from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const q = query(
        collection(db, 'profiles', user.uid, 'entries'),
        orderBy('date', 'desc'),
        limit(7)
      );
      const snap = await getDocs(q);
      const entries = snap.docs.map(doc => ({
        ...doc.data(),
        displayDate: formatDate(doc.data().date.toDate())
      })).reverse();
      setData(entries);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const stats = data.reduce((acc, entry) => {
    acc.faturamento += entry.grossRevenue;
    acc.lucro += entry.calculatedMetrics.netProfit;
    acc.km += entry.totalKm;
    if (!acc.bestDay || entry.calculatedMetrics.netProfit > acc.bestDay.profit) {
      acc.bestDay = { date: entry.displayDate, profit: entry.calculatedMetrics.netProfit };
    }
    return acc;
  }, { faturamento: 0, lucro: 0, km: 0, bestDay: null as any });

  const shareSummary = () => {
    const text = `📊 Resumo Semanal - Lucro por KM\n\n💰 Faturamento: ${formatCurrency(stats.faturamento)}\n✅ Lucro Real: ${formatCurrency(stats.lucro)}\n🚗 KM Total: ${stats.km}km\n📈 Média Lucro/KM: ${formatCurrency(stats.km > 0 ? stats.lucro / stats.km : 0)}\n\nDomine seu financeiro com Lucro por KM!`;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(url);
  };

  if (loading) return null;

  return (
    <Layout title="Relatórios">
      <div className="space-y-10">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Análise de Performance</span>
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Últimos 7 dias</h2>
          </div>
          <button 
            onClick={shareSummary}
            className="w-12 h-12 bg-emerald-500 rounded-2xl text-black flex items-center justify-center hover:bg-emerald-400 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <Share2 size={20} />
          </button>
        </header>

        {/* Chart */}
        <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
           <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic">Tendência de Lucro</h3>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-bold text-gray-400">Lucratividade</span>
                </div>
              </div>
              
              <div className="h-64 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis 
                      dataKey="displayDate" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#374151', fontSize: 9, fontWeight: 900 }}
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-zinc-900 border border-white/10 p-4 rounded-3xl shadow-2xl">
                              <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1 italic">{payload[0].payload.displayDate}</p>
                              <p className="text-lg font-black text-white italic tracking-tighter">{formatCurrency(payload[0].value as number)}</p>
                              <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">Lucro Líquido</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="calculatedMetrics.netProfit" radius={[8, 8, 0, 0]} barSize={24}>
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.calculatedMetrics.netProfit > 0 ? '#10b981' : '#ef4444'} 
                          fillOpacity={0.9}
                          className="hover:opacity-80 transition-opacity cursor-pointer shadow-lg"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-zinc-900 p-6 rounded-[32px] border border-white/5 space-y-5 group hover:border-emerald-500/20 transition-colors">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Trophy size={18} className="text-emerald-500" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 italic">Melhor Resultado</span>
              <div className="font-black text-white italic tracking-tighter truncate">{stats.bestDay?.date || '-'}</div>
              <div className="text-xs text-emerald-500 font-black italic">+{formatCurrency(stats.bestDay?.profit || 0)}</div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-[32px] border border-white/5 space-y-5 group hover:border-blue-500/20 transition-colors">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Calendar size={18} className="text-blue-500" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 italic">Acumulado 7 dias</span>
              <div className="font-black text-white italic tracking-tighter">{formatCurrency(stats.lucro)}</div>
              <div className="text-[10px] text-gray-500 font-bold">{stats.km} KM TOTAL</div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <section className="bg-zinc-900 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="divide-y divide-white/5 relative z-10">
               <StatRow label="Faturamento Bruto" value={formatCurrency(stats.faturamento)} />
               <StatRow label="Custo Operacional Total" value={formatCurrency(stats.faturamento - stats.lucro)} color="text-red-400" />
               <StatRow label="Média Lucro / KM" value={formatCurrency(stats.km > 0 ? stats.lucro / stats.km : 0)} color="text-emerald-400" />
               <StatRow label="Eficiência Financeira" value={(stats.faturamento > 0 ? (stats.lucro / stats.faturamento) * 100 : 0).toFixed(1) + '%'} color="text-blue-400" />
            </div>
        </section>
      </div>
    </Layout>
  );
}

function StatRow({ label, value, color }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex justify-between items-center p-5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={cn("text-sm font-bold font-mono", color)}>{value}</span>
    </div>
  );
}
