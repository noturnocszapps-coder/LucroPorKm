import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Input, Button, Select } from '../components/UI';
import { LogOut, Save, Shield, Star, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    vehicleName: profile?.vehicleName || '',
    vehicleType: profile?.vehicleType || 'proprio',
    fuelType: profile?.fuelType || 'flex',
    avgConsumption: profile?.avgConsumption || '',
    fuelPrice: profile?.fuelPrice || '',
    fixedCostsMonthly: profile?.fixedCostsMonthly || '',
    maintenanceMonthly: profile?.maintenanceMonthly || '',
  });

  const handleUpdate = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);

    try {
      await updateDoc(doc(db, 'profiles', user.uid), {
        ...formData,
        avgConsumption: Number(formData.avgConsumption),
        fuelPrice: Number(formData.fuelPrice),
        fixedCostsMonthly: Number(formData.fixedCostsMonthly),
        maintenanceMonthly: Number(formData.maintenanceMonthly),
      });
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar as configurações.');
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
      <div className="space-y-8">
        {/* User Badge */}
        <section className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-lg">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-100">{user?.email}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-widest",
                profile?.isPremium ? "bg-amber-400/20 text-amber-500" : "bg-gray-500/20 text-gray-500"
              )}>
                {profile?.isPremium ? "Premium" : "Grátis"}
              </span>
            </div>
          </div>
        </section>

        {/* Premium Banner */}
        {!profile?.isPremium && (
          <section className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 p-5 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <h4 className="font-bold text-amber-100 text-sm">Seja Premium em Breve</h4>
              </div>
              <p className="text-xs text-amber-500/80 mb-3 leading-relaxed">
                Desbloqueie relatórios avançados, exportação CSV e metas ilimitadas. Continue rodando e avisaremos quando estiver disponível!
              </p>
              <button 
                className="text-[10px] font-bold uppercase text-amber-500 flex items-center gap-1 group-hover:gap-2 transition-all"
                onClick={() => alert('Planos R$ 9,90/mês — Em Breve!')}
              >
                Conhecer planos <ExternalLink size={10} />
              </button>
            </div>
            <Star size={64} className="absolute -bottom-4 -right-4 text-amber-500/10 -rotate-12" />
          </section>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-500 text-sm font-bold text-center">
              Perfil atualizado com sucesso!
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Dados da Operação</h4>
            <div className="bg-zinc-900 rounded-3xl p-6 border border-white/5 space-y-6">
              <Input 
                label="Veículo" 
                value={formData.vehicleName}
                onChange={(e) => handleUpdate('vehicleName', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Consumo (km/l)" 
                  type="number"
                  step="0.1"
                  value={formData.avgConsumption}
                  onChange={(e) => handleUpdate('avgConsumption', e.target.value)}
                />
                <Input 
                  label="Preço Combustível" 
                  type="number"
                  step="0.01"
                  value={formData.fuelPrice}
                  onChange={(e) => handleUpdate('fuelPrice', e.target.value)}
                />
              </div>
              <Input 
                label="Custo Fixo Mensal" 
                type="number"
                value={formData.fixedCostsMonthly}
                onChange={(e) => handleUpdate('fixedCostsMonthly', e.target.value)}
              />
              <Input 
                label="Reserva Manutenção" 
                type="number"
                value={formData.maintenanceMonthly}
                onChange={(e) => handleUpdate('maintenanceMonthly', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" isLoading={loading} className="w-full">
              <Save size={18} /> Salvar Alterações
            </Button>
            
            <button 
              type="button" 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all text-red-500 border border-red-500/20 hover:bg-red-500/5"
            >
              <LogOut size={18} /> Sair da Conta
            </button>
          </div>
        </form>

        <footer className="text-center pb-8">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Lucro por KM v1.0.0 — NT Aplicações</p>
        </footer>
      </div>
    </Layout>
  );
}
