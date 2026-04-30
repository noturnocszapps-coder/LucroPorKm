import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Input, Button, Select } from '../components/UI';
import { Car, Fuel, Wallet, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleName: '',
    vehicleType: 'proprio',
    fuelType: 'flex',
    avgConsumption: '',
    fuelPrice: '',
    fixedCostsMonthly: '',
    maintenanceMonthly: '',
  });

  const handleUpdate = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'profiles', user.uid), {
        ...formData,
        avgConsumption: Number(formData.avgConsumption),
        fuelPrice: Number(formData.fuelPrice),
        fixedCostsMonthly: Number(formData.fixedCostsMonthly),
        maintenanceMonthly: Number(formData.maintenanceMonthly),
        onboardingCompleted: true
      });
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 selection:bg-emerald-500/30">
      <div className="max-w-md mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Configure sua operação</h1>
          <p className="text-gray-400 text-sm mt-2 font-light">Precisamos desses dados para calcular seu lucro real automaticamente.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Veículo */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Car size={18} className="text-emerald-500" />
              </div>
              <h2 className="font-bold text-sm uppercase tracking-widest text-gray-300">Veículo</h2>
            </div>
            <Input 
              label="Nome do Veículo" 
              placeholder="Ex: Fiat Cronos 1.3" 
              value={formData.vehicleName}
              onChange={(e) => handleUpdate('vehicleName', e.target.value)}
              required
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
            />
          </section>

          {/* Combustível */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Fuel size={18} className="text-emerald-500" />
              </div>
              <h2 className="font-bold text-sm uppercase tracking-widest text-gray-300">Combustível</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Tipo" 
                value={formData.fuelType}
                onChange={(e: any) => handleUpdate('fuelType', e.target.value)}
                options={[
                  { label: 'Flex', value: 'flex' },
                  { label: 'Gasolina', value: 'gasolina' },
                  { label: 'Etanol', value: 'etanol' },
                  { label: 'Diesel', value: 'diesel' },
                  { label: 'GNV', value: 'gnv' },
                ]}
              />
              <Input 
                label="Consumo Médio" 
                placeholder="Ex: 12.5" 
                suffix="km/l"
                type="number"
                step="0.1"
                value={formData.avgConsumption}
                onChange={(e) => handleUpdate('avgConsumption', e.target.value)}
                required
              />
            </div>
            <Input 
              label="Preço Atual do Litro" 
              placeholder="Ex: 5.89" 
              prefix="R$"
              type="number"
              step="0.01"
              value={formData.fuelPrice}
              onChange={(e) => handleUpdate('fuelPrice', e.target.value)}
              required
            />
          </section>

          {/* Custos Fixos */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Wallet size={18} className="text-emerald-500" />
              </div>
              <h2 className="font-bold text-sm uppercase tracking-widest text-gray-300">Custos & Reservas</h2>
            </div>
            <Input 
              label="Custo Fixo Mensal" 
              placeholder="Aluguel, seguro, internet, celular..." 
              prefix="R$"
              type="number"
              value={formData.fixedCostsMonthly}
              onChange={(e) => handleUpdate('fixedCostsMonthly', e.target.value)}
              required
            />
            <Input 
              label="Reserva para Manutenção" 
              placeholder="Provisione óleo, pneus e revisões" 
              prefix="R$"
              type="number"
              value={formData.maintenanceMonthly}
              onChange={(e) => handleUpdate('maintenanceMonthly', e.target.value)}
              required
            />
            <p className="text-[10px] text-gray-500 px-2 leading-relaxed">
              * Recomendamos provisionar pelo menos R$ 300/mês para manutenção preventiva.
            </p>
          </section>

          <div className="pt-4">
            <Button type="submit" isLoading={loading} className="w-full flex items-center justify-center gap-2 group">
              Concluir e Ir ao Painel
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
