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
      <div className="space-y-8">
        <header className="flex justify-between items-center text-left">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Performance</p>
            <h2 className="text-xl font-bold">Últimos 7 dias</h2>
          </div>
          <button 
            onClick={shareSummary}
            className="p-3 bg-emerald-500 rounded-2xl text-black hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
          >
            <Share2 size={20} />
          </button>
        </header>

        {/* Chart */}
        <div className="h-64 bg-zinc-900 p-6 rounded-3xl border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4b5563', fontSize: 10 }}
                dx={-0}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black border border-white/10 p-3 rounded-xl shadow-xl">
                        <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">{payload[0].payload.displayDate}</p>
                        <p className="text-sm font-bold text-emerald-400">{formatCurrency(payload[0].value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="calculatedMetrics.netProfit" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.calculatedMetrics.netProfit > 0 ? '#10b981' : '#f87171'} 
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 p-5 rounded-3xl border border-white/5 space-y-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl w-fit">
              <Trophy size={16} className="text-emerald-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Melhor Dia</span>
              <div className="font-bold text-gray-100">{stats.bestDay?.date || '-'}</div>
              <div className="text-xs text-emerald-500 font-medium">+{formatCurrency(stats.bestDay?.profit || 0)}</div>
            </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-3xl border border-white/5 space-y-4">
            <div className="p-2 bg-blue-500/10 rounded-xl w-fit">
              <Calendar size={16} className="text-blue-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Lucro Semanal</span>
              <div className="font-bold text-gray-100">{formatCurrency(stats.lucro)}</div>
              <div className="text-xs text-gray-500">{stats.km} km rodados</div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
         <div className="bg-zinc-900 rounded-3xl border border-white/5 divide-y divide-white/5 overflow-hidden">
            <StatRow label="Faturamento Total" value={formatCurrency(stats.faturamento)} />
            <StatRow label="Custo Médio p/ KM" value={formatCurrency(stats.km > 0 ? (stats.faturamento - stats.lucro) / stats.km : 0)} color="text-red-400" />
            <StatRow label="Média Lucro p/ KM" value={formatCurrency(stats.km > 0 ? stats.lucro / stats.km : 0)} color="text-emerald-400" />
            <StatRow label="Margem de Lucro" value={(stats.faturamento > 0 ? (stats.lucro / stats.faturamento) * 100 : 0).toFixed(1) + '%'} color="text-blue-400" />
         </div>
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
