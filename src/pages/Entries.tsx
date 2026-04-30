import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Input, Button, Select } from '../components/UI';
import { calculateDailyMetrics } from '../lib/calculations';
import { PlusCircle, Wallet, Fuel, Gauge } from 'lucide-react';

export default function Entries() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    platform: 'Uber',
    grossRevenue: '',
    totalKm: '',
    rideKm: '',
    fuelLiters: '',
    extraExpenses: {
      alimentacao: '',
      estacionamento: '',
      lavagem: '',
      outros: ''
    }
  });

  const handleUpdate = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExtraUpdate = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      extraExpenses: { ...prev.extraExpenses, [field]: value } 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setLoading(true);
    setSuccess(false);

    try {
      const extraTotal = Object.values(formData.extraExpenses).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
      
      const metrics = calculateDailyMetrics(
        Number(formData.grossRevenue),
        Number(formData.totalKm),
        {
          fuelPrice: Number(profile.fuelPrice) || 0,
          avgConsumption: Number(profile.avgConsumption) || 0,
          fixedCostsMonthly: Number(profile.fixedCostsMonthly) || 0,
          maintenanceMonthly: Number(profile.maintenanceMonthly) || 0
        },
        Number(extraTotal) || 0
      );

      await addDoc(collection(db, 'profiles', user.uid, 'entries'), {
        date: Timestamp.fromDate(new Date(formData.date)),
        platform: formData.platform,
        grossRevenue: Number(formData.grossRevenue),
        totalKm: Number(formData.totalKm),
        rideKm: Number(formData.rideKm) || 0,
        fuelLiters: Number(formData.fuelLiters) || 0,
        extraExpenses: Object.entries(formData.extraExpenses).map(([category, amount]) => ({
          category,
          amount: Number(amount) || 0
        })),
        calculatedMetrics: metrics,
        createdAt: Timestamp.now()
      });

      setSuccess(true);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        platform: 'Uber',
        grossRevenue: '',
        totalKm: '',
        rideKm: '',
        fuelLiters: '',
        extraExpenses: {
          alimentacao: '',
          estacionamento: '',
          lavagem: '',
          outros: ''
        }
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar lançamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Lançar Ganhos">
      <div className="space-y-6">
        <header>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Registro Diário</p>
          <h2 className="text-xl font-bold">Quanto você rodou hoje?</h2>
        </header>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-500 text-sm font-bold text-center animate-bounce">
            Lançamento salvo com sucesso! 🚀
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados Principais */}
          <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <PlusCircle size={18} className="text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">Resumo da Corrida</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Data" 
                type="date" 
                value={formData.date}
                onChange={(e) => handleUpdate('date', e.target.value)}
                required
              />
              <Select 
                label="Plataforma" 
                value={formData.platform}
                onChange={(e: any) => handleUpdate('platform', e.target.value)}
                options={[
                  { label: 'Uber', value: 'Uber' },
                  { label: '99', value: '99' },
                  { label: 'inDrive', value: 'inDrive' },
                  { label: 'Particular', value: 'Particular' },
                  { label: 'Outros', value: 'Outros' },
                ]}
              />
            </div>

            <Input 
              label="Faturamento Bruto" 
              placeholder="0,00" 
              prefix="R$"
              type="number"
              step="0.01"
              value={formData.grossRevenue}
              onChange={(e) => handleUpdate('grossRevenue', e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="KM Total Rodado" 
                placeholder="0" 
                suffix="km"
                type="number"
                value={formData.totalKm}
                onChange={(e) => handleUpdate('totalKm', e.target.value)}
                required
              />
              <Input 
                label="KM em Corrida" 
                placeholder="0" 
                suffix="km"
                type="number"
                value={formData.rideKm}
                onChange={(e) => handleUpdate('rideKm', e.target.value)}
              />
            </div>
          </div>

          {/* Custos Extras */}
          <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={18} className="text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">Despesas Extras</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <Input 
                label="Alimentação" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.alimentacao}
                onChange={(e) => handleExtraUpdate('alimentacao', e.target.value)}
              />
              <Input 
                label="Estacionamento" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.estacionamento}
                onChange={(e) => handleExtraUpdate('estacionamento', e.target.value)}
              />
              <Input 
                label="Lavagem" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.lavagem}
                onChange={(e) => handleExtraUpdate('lavagem', e.target.value)}
              />
              <Input 
                label="Outros" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.outros}
                onChange={(e) => handleExtraUpdate('outros', e.target.value)}
              />
            </div>
          </div>

          {/* Abastecimento */}
          <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Fuel size={18} className="text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300">Abastecimento (Opcional)</h3>
            </div>
            <Input 
              label="Litros Abastecidos" 
              placeholder="0.0" 
              suffix="L"
              type="number"
              step="0.01"
              value={formData.fuelLiters}
              onChange={(e) => handleUpdate('fuelLiters', e.target.value)}
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full">
            Salvar Lançamento
          </Button>
        </form>
      </div>
    </Layout>
  );
}
