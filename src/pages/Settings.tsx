import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
import { Input, Button, Select } from '../components/UI';
import { LogOut, Save, Shield, Star, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleName: profile?.vehicleName || '',
    vehicleType: profile?.vehicleType || 'proprio',
    rentFrequency: profile?.rentFrequency || 'semanal',
    rentValue: profile?.rentValue || '',
    financingInstallment: profile?.financingInstallment || '',
    fuelType: profile?.fuelType || 'flex',
    avgConsumption: profile?.avgConsumption || '',
    fuelPrice: profile?.fuelPrice || '',
    insuranceMonthly: profile?.insuranceMonthly || '',
    internetMonthly: profile?.internetMonthly || '',
    washMonthly: profile?.washMonthly || '',
    otherFixedMonthly: profile?.otherFixedMonthly || '',
    maintenanceMonthly: profile?.maintenanceMonthly || '',
    tiresMonthly: profile?.tiresMonthly || '',
    oilMonthly: profile?.oilMonthly || '',
    brakesMonthly: profile?.brakesMonthly || '',
    unexpectedMonthly: profile?.unexpectedMonthly || '',
    dailyProfitGoal: profile?.dailyProfitGoal || '150',
  });

  const handleUpdate = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await updateDoc(doc(db, 'profiles', user.uid), {
        ...formData,
        rentValue: Number(formData.rentValue) || 0,
        financingInstallment: Number(formData.financingInstallment) || 0,
        avgConsumption: Number(formData.avgConsumption) || 0,
        fuelPrice: Number(formData.fuelPrice) || 0,
        insuranceMonthly: Number(formData.insuranceMonthly) || 0,
        internetMonthly: Number(formData.internetMonthly) || 0,
        washMonthly: Number(formData.washMonthly) || 0,
        otherFixedMonthly: Number(formData.otherFixedMonthly) || 0,
        maintenanceMonthly: Number(formData.maintenanceMonthly) || 0,
        tiresMonthly: Number(formData.tiresMonthly) || 0,
        oilMonthly: Number(formData.oilMonthly) || 0,
        brakesMonthly: Number(formData.brakesMonthly) || 0,
        unexpectedMonthly: Number(formData.unexpectedMonthly) || 0,
        dailyProfitGoal: Number(formData.dailyProfitGoal) || 150,
        updatedAt: new Date().toISOString()
      });
      await refreshProfile();
      showToast('Configurações salvas!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar as configurações.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <Layout title="Configurações">
      <div className="space-y-10">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Configurações Base</span>
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Sua Operação</h2>
          </div>
          <div className="text-right">
             <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 text-emerald-500 shadow-xl">
                <Shield size={24} />
             </div>
          </div>
        </header>

        {/* User Badge */}
        <section className="bg-zinc-900 rounded-[32px] p-8 border border-white/5 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-700" />
          
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center text-black font-black text-2xl rotate-3 group-hover:rotate-0 transition-transform shadow-xl shadow-emerald-500/20">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 relative z-10">
            <h3 className="font-black text-white italic tracking-tighter text-xl truncate">{user?.email}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[9px] uppercase font-black px-3 py-1 rounded-full tracking-[0.1em] italic",
                profile?.isPremium ? "bg-amber-400 text-black px-4" : "bg-zinc-800 text-gray-500"
              )}>
                {profile?.isPremium ? "Membro Premium" : "Plano Básico"}
              </span>
              {profile?.isPremium && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
            </div>
          </div>
        </section>

        {/* Premium Banner */}
        {!profile?.isPremium && (
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border-2 border-amber-500/20 p-8 rounded-[40px] relative overflow-hidden group shadow-2xl"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                   <Star size={20} className="text-black fill-black" />
                </div>
                <h4 className="font-black text-white uppercase italic tracking-tighter text-lg">Liberação Premium</h4>
              </div>
              <p className="text-[13px] text-amber-200/70 leading-relaxed font-medium">
                Desbloqueie análises de eficiência avançadas, modo noturno customizado e exportação de dados para contabilidade.
              </p>
              <button 
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10 active:scale-95"
                onClick={() => alert('Planos R$ 9,90/mês — Em Breve!')}
              >
                Ativar com 40% OFF <ExternalLink size={14} />
              </button>
            </div>
            <Star size={120} className="absolute -bottom-8 -right-8 text-amber-500/5 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
          </motion.section>
        )}

        <form onSubmit={handleSave} className="space-y-12">
          <div className="space-y-10">
            {/* Meta Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 italic">Metas & Objetivos</h4>
              </div>
              <div className="bg-zinc-900 rounded-[40px] p-8 border border-white/5 space-y-8 shadow-2xl">
                <Input 
                  label="Meta de Lucro Líquido Diário" 
                  description="Quanto você quer colocar no bolso todos os dias?"
                  type="number"
                  prefix="R$"
                  value={formData.dailyProfitGoal}
                  onChange={(e) => handleUpdate('dailyProfitGoal', e.target.value)}
                  className="text-2xl font-black italic bg-black/20"
                />
              </div>
            </div>

            {/* Veículo Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 italic">Dados do Veículo</h4>
              </div>
              
              <div className="bg-zinc-900 rounded-[40px] p-8 border border-white/5 space-y-8 shadow-2xl">
                <Input 
                  label="Identificação do Carro" 
                  value={formData.vehicleName}
                  onChange={(e) => handleUpdate('vehicleName', e.target.value)}
                  className="bg-black/20"
                />
                
                <Select 
                  label="Tipo de posse" 
                  value={formData.vehicleType}
                  onChange={(e: any) => handleUpdate('vehicleType', e.target.value)}
                  options={[
                    { label: 'Próprio', value: 'proprio' },
                    { label: 'Financiado', value: 'financiado' },
                    { label: 'Alugado', value: 'alugado' },
                  ]}
                  className="bg-black/20"
                />

                {formData.vehicleType === 'alugado' && (
                  <div className="grid grid-cols-2 gap-6">
                    <Select 
                      label="Ciclo de Pagamento"
                      value={formData.rentFrequency}
                      onChange={(e: any) => handleUpdate('rentFrequency', e.target.value)}
                      options={[
                        { label: 'Semanal', value: 'semanal' },
                        { label: 'Mensal', value: 'mensal' },
                      ]}
                      className="bg-black/40"
                    />
                    <Input 
                      label="Valor do Aluguel"
                      prefix="R$"
                      type="number"
                      value={formData.rentValue}
                      onChange={(e) => handleUpdate('rentValue', e.target.value)}
                      className="bg-black/40"
                    />
                  </div>
                )}

                {formData.vehicleType === 'financiado' && (
                  <Input 
                    label="Parcela do Financiamento"
                    prefix="R$"
                    type="number"
                    value={formData.financingInstallment}
                    onChange={(e) => handleUpdate('financingInstallment', e.target.value)}
                    className="bg-black/40"
                  />
                )}

                <div className="grid grid-cols-2 gap-6">
                  <Input 
                    label="Consumo Médio" 
                    placeholder="km/l"
                    suffix="km/L"
                    type="number"
                    step="0.1"
                    value={formData.avgConsumption}
                    onChange={(e) => handleUpdate('avgConsumption', e.target.value)}
                    className="bg-black/40"
                  />
                  <Input 
                    label="Preço do Litro" 
                    prefix="R$"
                    type="number"
                    step="0.01"
                    value={formData.fuelPrice}
                    onChange={(e) => handleUpdate('fuelPrice', e.target.value)}
                    className="bg-black/40"
                  />
                </div>
              </div>
            </div>

            {/* Custos Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 italic">Custos & Reservas</h4>
              </div>
              <div className="bg-zinc-900 rounded-[40px] p-8 border border-white/5 grid grid-cols-2 gap-x-6 gap-y-10 shadow-2xl">
                <Input 
                  label="Seguro" 
                  type="number"
                  prefix="R$"
                  value={formData.insuranceMonthly}
                  onChange={(e) => handleUpdate('insuranceMonthly', e.target.value)}
                  className="bg-black/20"
                />
                <Input 
                  label="Internet" 
                  type="number"
                  prefix="R$"
                  value={formData.internetMonthly}
                  onChange={(e) => handleUpdate('internetMonthly', e.target.value)}
                  className="bg-black/20"
                />
                <Input 
                  label="Manutenção Est." 
                  type="number"
                  prefix="R$"
                  value={formData.maintenanceMonthly}
                  onChange={(e) => handleUpdate('maintenanceMonthly', e.target.value)}
                  className="bg-black/20"
                />
                <Input 
                  label="Reserva Pneus" 
                  type="number"
                  prefix="R$"
                  value={formData.tiresMonthly}
                  onChange={(e) => handleUpdate('tiresMonthly', e.target.value)}
                  className="bg-black/20"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <Button 
               type="submit" 
               isLoading={loading} 
               className="w-full h-20 text-lg font-black uppercase tracking-[0.2em] italic rounded-[32px] bg-emerald-500 text-black shadow-2xl active:scale-95 transition-all"
            >
              <Save size={20} className="mr-2" /> Salvar Alterações
            </Button>
            
            <button 
              type="button" 
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full h-16 rounded-[28px] font-black uppercase tracking-[0.1em] italic transition-all text-red-500 border-2 border-red-500/10 hover:bg-red-500/5 active:scale-95"
            >
              <LogOut size={18} /> Encerrar Sessão
            </button>
          </div>
        </form>

        <footer className="text-center pb-12 pt-8">
          <p className="text-[9px] text-gray-700 uppercase tracking-[0.4em] font-black italic">
            Lucro por KM <span className="text-emerald-500/50 underline">v2.0.0 PRO</span> — Powered by NT Aplicações
          </p>
        </footer>
      </div>
    </Layout>
  );
}
