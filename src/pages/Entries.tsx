import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
import { Input, Button, Select } from '../components/UI';
import { calculateDailyMetrics } from '../lib/calculations';
import { cn } from '../lib/utils';
import { PlusCircle, Wallet, Fuel, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Entries() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    platform: 'Uber',
    grossRevenue: '',
    totalKm: '',
    rideKm: '',
    fuelLiters: '',
    extraExpenses: {
      combustivel: '',
      alimentacao: '',
      manutencao: '',
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

    try {
      const extraTotal = Object.values(formData.extraExpenses).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
      
      const metrics = calculateDailyMetrics(
        Number(formData.grossRevenue),
        Number(formData.totalKm),
        {
          fuelPrice: Number(profile.fuelPrice) || 0,
          avgConsumption: Number(profile.avgConsumption) || 0,
          vehicleType: profile.vehicleType || 'proprio',
          rentFrequency: profile.rentFrequency,
          rentValue: Number(profile.rentValue) || 0,
          financingInstallment: Number(profile.financingInstallment) || 0,
          insuranceMonthly: Number(profile.insuranceMonthly) || 0,
          internetMonthly: Number(profile.internetMonthly) || 0,
          washMonthly: Number(profile.washMonthly) || 0,
          otherFixedMonthly: Number(profile.otherFixedMonthly) || 0,
          maintenanceMonthly: Number(profile.maintenanceMonthly) || 0,
          tiresMonthly: Number(profile.tiresMonthly) || 0,
          oilMonthly: Number(profile.oilMonthly) || 0,
          brakesMonthly: Number(profile.brakesMonthly) || 0,
          unexpectedMonthly: Number(profile.unexpectedMonthly) || 0,
        },
        Number(extraTotal) || 0
      );

      await addDoc(collection(db, 'profiles', user.uid, 'entries'), {
        date: Timestamp.fromDate(new Date(formData.date)),
        platform: formData.platform,
        grossRevenue: Number(formData.grossRevenue),
        totalKm: Number(formData.totalKm),
        rideKm: Number(formData.rideKm) || 0,
        fuelLitersDay: Number(formData.fuelLiters) || 0,
        extraExpenses: Object.entries(formData.extraExpenses).map(([category, amount]) => ({
          category,
          amount: Number(amount) || 0
        })),
        calculatedMetrics: metrics,
        createdAt: Timestamp.now()
      });

      showToast('Lançamento adicionado!', 'success');
      setShowSuccess(true);
      setFormKey(prev => prev + 1);
      setTimeout(() => setShowSuccess(false), 2000);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        platform: 'Uber',
        grossRevenue: '',
        totalKm: '',
        rideKm: '',
        fuelLiters: '',
        extraExpenses: {
          combustivel: '',
          alimentacao: '',
          manutencao: '',
          estacionamento: '',
          lavagem: '',
          outros: ''
        }
      });
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar lançamento.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Lançar Ganhos">
      <div className="space-y-10">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Registro Operacional</span>
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Novo Lançamento</h2>
          </div>
          <div className="text-right">
             <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 text-emerald-500">
                <PlusCircle size={24} />
             </div>
          </div>
        </header>

        <motion.form 
          key={formKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit} 
          className="space-y-8 pb-10"
        >
          {/* Dados Principais */}
          <div className="bg-zinc-900 rounded-[40px] p-8 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
            
            <div className="flex items-center gap-3 relative z-10 border-b border-white/5 pb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 size={20} className="text-emerald-500" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 italic">Dados do Dia</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <Input 
                label="Qual o dia?" 
                type="date" 
                value={formData.date}
                onChange={(e) => handleUpdate('date', e.target.value)}
                required
                className="bg-black/40"
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
                className="bg-black/40"
              />
            </div>

            <Input 
              label="Faturamento Total" 
              placeholder="0,00" 
              prefix="R$"
              type="number"
              step="0.01"
              value={formData.grossRevenue}
              onChange={(e) => handleUpdate('grossRevenue', e.target.value)}
              required
              className="text-2xl font-black italic bg-black/40"
            />

            <div className="grid grid-cols-2 gap-6 relative z-10">
              <Input 
                label="KM Total Rodado" 
                placeholder="0" 
                suffix="km"
                type="number"
                value={formData.totalKm}
                onChange={(e) => handleUpdate('totalKm', e.target.value)}
                required
                className="bg-black/40"
              />
              <Input 
                label="KM em Corrida" 
                placeholder="0" 
                suffix="km"
                type="number"
                value={formData.rideKm}
                onChange={(e) => handleUpdate('rideKm', e.target.value)}
                className="bg-black/40"
              />
            </div>
          </div>

          {/* Custos Extras */}
          <div className="bg-zinc-900 rounded-[40px] p-8 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full -ml-16 -mb-16" />
            
            <div className="flex items-center gap-3 relative z-10 border-b border-white/5 pb-6">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                <Wallet size={20} className="text-red-500" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 italic">Despesas Extras</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8 relative z-10">
              <Input 
                label="Combustível" 
                placeholder="R$ extra" 
                prefix="R$"
                value={formData.extraExpenses.combustivel}
                onChange={(e) => handleExtraUpdate('combustivel', e.target.value)}
                className="bg-black/20"
              />
              <Input 
                label="Alimentação" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.alimentacao}
                onChange={(e) => handleExtraUpdate('alimentacao', e.target.value)}
                className="bg-black/20"
              />
              <Input 
                label="Manutenção" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.manutencao}
                onChange={(e) => handleExtraUpdate('manutencao', e.target.value)}
                className="bg-black/20"
              />
              <Input 
                label="Estacionamento" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.estacionamento}
                onChange={(e) => handleExtraUpdate('estacionamento', e.target.value)}
                className="bg-black/20"
              />
              <Input 
                label="Lavagem" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.lavagem}
                onChange={(e) => handleExtraUpdate('lavagem', e.target.value)}
                className="bg-black/20"
              />
              <Input 
                label="Outros" 
                placeholder="0,00" 
                prefix="R$"
                value={formData.extraExpenses.outros}
                onChange={(e) => handleExtraUpdate('outros', e.target.value)}
                className="bg-black/20"
              />
            </div>
          </div>

          {/* Abastecimento */}
          <div className="bg-zinc-900 rounded-[40px] p-8 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10 border-b border-white/5 pb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Fuel size={20} className="text-blue-500" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 italic">Abastecimento <span className="text-[10px] lowercase text-gray-500">(opcional)</span></h3>
            </div>
            <Input 
              label="Litros Adicionados hoje" 
              placeholder="0.0" 
              suffix="L"
              type="number"
              step="0.01"
              value={formData.fuelLiters}
              onChange={(e) => handleUpdate('fuelLiters', e.target.value)}
              className="bg-black/40"
            />
          </div>

          <Button 
            type="submit" 
            isLoading={loading} 
            className={cn(
              "w-full h-20 text-lg font-black uppercase tracking-[0.2em] italic rounded-[32px] transition-all duration-700 active:scale-95",
              showSuccess ? "bg-emerald-500 hover:bg-emerald-500 text-black shadow-[0_15px_40px_rgba(16,185,129,0.4)]" : "bg-emerald-500 text-black shadow-2xl"
            )}
          >
            {showSuccess ? (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={24} />
                <span>Processado!</span>
              </motion.div>
            ) : (
              "Salvar Movimentação"
            )}
          </Button>
        </motion.form>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1.1, y: 0 }}
              exit={{ scale: 0.5, y: -20 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-emerald-500 p-6 rounded-full shadow-2xl shadow-emerald-500/40"
            >
              <CheckCircle2 size={48} className="text-black" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
