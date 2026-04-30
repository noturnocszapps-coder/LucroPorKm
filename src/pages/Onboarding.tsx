import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Input, Button, Select } from '../components/UI';
import { 
  Car, Fuel, Wallet, ArrowRight, ArrowLeft, 
  CheckCircle2, Info, ShieldCheck, Gauge, 
  TrendingUp, CircleDollarSign, Wrench
} from 'lucide-react';
import { calculateMonthlyFixedCosts, calculateMonthlyReserves } from '../lib/calculations';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../contexts/ToastContext';

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    vehicleName: '',
    vehicleType: 'proprio' as 'proprio' | 'financiado' | 'alugado',
    rentFrequency: 'semanal' as 'semanal' | 'mensal',
    rentValue: '',
    financingInstallment: '',
    fuelType: 'flex',
    avgConsumption: '',
    fuelPrice: '',
    // Fixed Costs
    insuranceMonthly: '',
    internetMonthly: '',
    washMonthly: '',
    otherFixedMonthly: '',
    // Reserves
    maintenanceMonthly: '',
    tiresMonthly: '',
    oilMonthly: '',
    brakesMonthly: '',
    unexpectedMonthly: '',
  });

  const handleUpdate = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const totals = useMemo(() => {
    const config = {
      ...formData,
      rentValue: Number(formData.rentValue) || 0,
      financingInstallment: Number(formData.financingInstallment) || 0,
      avgConsumption: Number(formData.avgConsumption) || 1,
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
    };

    const monthlyFixed = calculateMonthlyFixedCosts(config);
    const monthlyReserves = calculateMonthlyReserves(config);
    const fuelPerKm = config.avgConsumption > 0 ? config.fuelPrice / config.avgConsumption : 0;

    return {
      monthlyFixed,
      dailyFixed: monthlyFixed / 30,
      monthlyReserves,
      dailyReserves: monthlyReserves / 30,
      fuelPerKm,
      totalDailyBase: (monthlyFixed + monthlyReserves) / 30
    };
  }, [formData]);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        vehicleType: formData.vehicleType,
        rentFrequency: formData.rentFrequency,
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
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'profiles', user.uid), dataToSave);
      await refreshProfile();
      showToast('Configuração concluída!', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar configurações.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Car size={28} className="text-emerald-500" />
                </div>
                <div>
                  <h2 className="font-black text-lg uppercase tracking-tight text-white italic leading-none">Seu possante</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Sua ferramenta de trabalho</p>
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <Input 
                  label="Nome do Veículo" 
                  placeholder="Ex: Fiat Cronos 1.3" 
                  value={formData.vehicleName}
                  onChange={(e) => handleUpdate('vehicleName', e.target.value)}
                  className="bg-black border-white/10"
                  required
                />
                
                <div className="space-y-4">
                  <Select 
                    label="Status da Posse" 
                    value={formData.vehicleType}
                    onChange={(e: any) => handleUpdate('vehicleType', e.target.value)}
                    options={[
                      { label: 'Próprio', value: 'proprio' },
                      { label: 'Financiado', value: 'financiado' },
                      { label: 'Alugado', value: 'alugado' },
                    ]}
                  />

                  <AnimatePresence>
                    {formData.vehicleType === 'alugado' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 pt-2 overflow-hidden border-t border-white/5 mt-4"
                      >
                        <Select 
                          label="Pagamento do Aluguel"
                          value={formData.rentFrequency}
                          onChange={(e: any) => handleUpdate('rentFrequency', e.target.value)}
                          options={[
                            { label: 'Semanal', value: 'semanal' },
                            { label: 'Mensal', value: 'mensal' },
                          ]}
                        />
                        <Input 
                          label={`Valor do Aluguel (${formData.rentFrequency})`}
                          prefix="R$"
                          type="number"
                          value={formData.rentValue}
                          onChange={(e) => handleUpdate('rentValue', e.target.value)}
                          required
                        />
                      </motion.div>
                    )}

                    {formData.vehicleType === 'financiado' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pt-2 overflow-hidden border-t border-white/5 mt-4"
                      >
                        <Input 
                          label="Parcela Mensal do Financiamento"
                          prefix="R$"
                          type="number"
                          value={formData.financingInstallment}
                          onChange={(e) => handleUpdate('financingInstallment', e.target.value)}
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            <Button onClick={nextStep} disabled={!formData.vehicleName} className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl">
              Próximo Passo
            </Button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Fuel size={28} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="font-black text-lg uppercase tracking-tight text-white italic leading-none">Abastecimento</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Quanto o seu carro consome?</p>
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    label="Combustível" 
                    value={formData.fuelType}
                    onChange={(e: any) => handleUpdate('fuelType', e.target.value)}
                    options={[
                      { label: 'Flex', value: 'flex' },
                      { label: 'Gasolina', value: 'gasolina' },
                      { label: 'Etanol', value: 'etanol' },
                      { label: 'GNV', value: 'gnv' },
                      { label: 'Diesel', value: 'diesel' },
                    ]}
                  />
                  <Input 
                    label="Consumo Médio" 
                    suffix="km/l"
                    type="number"
                    step="0.1"
                    value={formData.avgConsumption}
                    onChange={(e) => handleUpdate('avgConsumption', e.target.value)}
                    required
                  />
                </div>

                <Input 
                  label="Preço do Litro" 
                  prefix="R$"
                  type="number"
                  step="0.01"
                  value={formData.fuelPrice}
                  onChange={(e) => handleUpdate('fuelPrice', e.target.value)}
                  required
                />

                <div className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/20 flex gap-4">
                  <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Custo Estimado</h4>
                    <p className="text-sm text-white font-bold leading-none">
                       R$ {totals.fuelPerKm.toFixed(2)} por KM rodado
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="px-8 h-16 rounded-[24px]">
                <ArrowLeft size={24} />
              </Button>
              <Button onClick={nextStep} disabled={!formData.avgConsumption || !formData.fuelPrice} className="flex-1 h-16 text-lg font-black uppercase tracking-[0.1em] rounded-3xl">
                Próximo Passo
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
                  <Wallet size={28} className="text-yellow-400" />
                </div>
                <div>
                  <h2 className="font-black text-lg uppercase tracking-tight text-white italic leading-none">Custos Fixos</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">As contas que não esperam</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 relative z-10">
                <Input 
                  label="Seguro" 
                  prefix="R$"
                  type="number"
                  value={formData.insuranceMonthly}
                  onChange={(e) => handleUpdate('insuranceMonthly', e.target.value)}
                />
                <Input 
                  label="Plano de Dados" 
                  prefix="R$"
                  type="number"
                  value={formData.internetMonthly}
                  onChange={(e) => handleUpdate('internetMonthly', e.target.value)}
                />
                <Input 
                  label="Higiene/Lavagem" 
                  prefix="R$"
                  type="number"
                  value={formData.washMonthly}
                  onChange={(e) => handleUpdate('washMonthly', e.target.value)}
                />
                <Input 
                  label="Outros" 
                  prefix="R$"
                  type="number"
                  value={formData.otherFixedMonthly}
                  onChange={(e) => handleUpdate('otherFixedMonthly', e.target.value)}
                />
              </div>

              <div className="p-5 bg-zinc-800 rounded-3xl text-center">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Total Estimado</span>
                <p className="text-xl font-black text-white italic">R$ {totals.monthlyFixed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-[10px] lowercase font-normal italic">/mês</span></p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="px-8 h-16 rounded-3xl">
                <ArrowLeft size={24} />
              </Button>
              <Button onClick={nextStep} className="flex-1 h-16 text-lg font-black uppercase tracking-[0.1em] rounded-3xl">
                Próximo Passo
              </Button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Wrench size={28} className="text-emerald-500" />
                </div>
                <div>
                  <h2 className="font-black text-lg uppercase tracking-tight text-white italic leading-none">Manutenção</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Não se deixe pegar de surpresa</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 relative z-10">
                <Input 
                  label="Revisão Geral" 
                  prefix="R$"
                  type="number"
                  value={formData.maintenanceMonthly}
                  onChange={(e) => handleUpdate('maintenanceMonthly', e.target.value)}
                />
                <Input 
                  label="Pneus" 
                  prefix="R$"
                  type="number"
                  value={formData.tiresMonthly}
                  onChange={(e) => handleUpdate('tiresMonthly', e.target.value)}
                />
                <Input 
                  label="Troca de Óleo" 
                  prefix="R$"
                  type="number"
                  value={formData.oilMonthly}
                  onChange={(e) => handleUpdate('oilMonthly', e.target.value)}
                />
                <Input 
                  label="Freios/Susp." 
                  prefix="R$"
                  type="number"
                  value={formData.brakesMonthly}
                  onChange={(e) => handleUpdate('brakesMonthly', e.target.value)}
                />
              </div>

              <Input 
                label="Fundo de Emergência" 
                description="Importante para multas ou pequenos acidentes"
                prefix="R$"
                type="number"
                value={formData.unexpectedMonthly}
                onChange={(e) => handleUpdate('unexpectedMonthly', e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="px-8 h-16 rounded-3xl">
                <ArrowLeft size={24} />
              </Button>
              <Button onClick={nextStep} className="flex-1 h-16 text-lg font-black uppercase tracking-[0.1em] rounded-3xl">
                Ver Resumo
              </Button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            <div className="bg-zinc-900 p-10 rounded-[48px] border-2 border-emerald-500 shadow-[0_20px_60px_rgba(16,185,129,0.15)] space-y-10 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full -mr-24 -mt-24" />
               <div className="relative z-10">
                 <div className="inline-flex p-5 bg-emerald-500/10 rounded-[24px] mb-6 border border-emerald-500/20">
                   <ShieldCheck size={40} className="text-emerald-500" />
                 </div>
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Excelente escolha!</h2>
                 <p className="text-sm text-gray-500 mt-2 font-medium">Sua operação profissional está configurada:</p>
               </div>

               <div className="grid grid-cols-2 gap-4 relative z-10">
                 <SummaryCard 
                   icon={<TrendingUp size={20} />}
                   label="Custo Fixo"
                   value={`R$ ${totals.monthlyFixed.toFixed(0)}`}
                   subLabel="Por mês"
                 />
                 <SummaryCard 
                   icon={<Wrench size={20} />}
                   label="Reservas"
                   value={`R$ ${totals.monthlyReserves.toFixed(0)}`}
                   subLabel="Manut./Pneus"
                 />
                 <SummaryCard 
                   icon={<Gauge size={20} />}
                   label="Custo/KM"
                   value={`R$ ${totals.fuelPerKm.toFixed(2)}`}
                   subLabel="Só combustível"
                 />
                 <SummaryCard 
                   icon={<CircleDollarSign size={20} />}
                   label="Fixo Diário"
                   value={`R$ ${totals.dailyFixed.toFixed(2)}`}
                   subLabel="Custo parado"
                 />
               </div>

               <div className="bg-emerald-500/10 p-8 rounded-[32px] border border-emerald-500/20 relative z-10 group overflow-hidden">
                 <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-[0.4em] mb-2 italic">Despesa Total Diária</p>
                 <div className="text-5xl font-black text-white italic tracking-tighter leading-none">
                   R$ {totals.totalDailyBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </div>
                 <p className="text-[11px] text-gray-500 mt-5 italic leading-relaxed font-medium">
                   "Você trabalha focado em cobrir esse valor primeiro. O que vier depois é <span className="text-emerald-500 font-bold uppercase">lucro real</span> no bolso."
                 </p>
               </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="px-8 h-18 rounded-[28px] text-gray-500"> Voltar </Button>
              <Button onClick={handleSubmit} isLoading={loading} className="flex-1 h-18 text-xl font-black uppercase tracking-[0.2em] rounded-[28px] shadow-2xl">
                Começar agora
              </Button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20 selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="max-w-md mx-auto">
        <header className="mb-12 text-center pt-8 space-y-6">
           <div className="flex justify-center gap-2">
             {[1, 2, 3, 4, 5].map(i => (
               <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-700 relative overflow-hidden ${i === step ? 'w-12 bg-emerald-500' : (i < step ? 'w-4 bg-emerald-500/40' : 'w-4 bg-white/10')}`} 
               >
                 {i === step && (
                   <motion.div 
                     layoutId="step-indicator"
                     className="absolute inset-0 bg-white/20 animate-pulse" 
                   />
                 )}
               </div>
             ))}
           </div>
           
           <AnimatePresence mode="wait">
             <motion.div 
               key={step}
               initial={{ y: 20, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
             >
               <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-tight">
                 {step === 1 && 'Sua Máquina'}
                 {step === 2 && 'Saída Estimada'}
                 {step === 3 && 'Fixos Inevitáveis'}
                 {step === 4 && 'Prevenção'}
                 {step === 5 && 'Configurado!'}
               </h1>
               <p className="text-gray-500 text-[10px] sm:text-xs mt-2 font-black uppercase tracking-[0.3em] italic">
                 {step === 1 && 'O primeiro passo para o lucro real.'}
                 {step === 2 && 'Quanto custa cada KM que você roda?'}
                 {step === 3 && 'As contas que vencem todo mês.'}
                 {step === 4 && 'O fundo reserva é a sua segurança.'}
                 {step === 5 && 'Sua operação agora é profissional.'}
               </p>
             </motion.div>
           </AnimatePresence>
        </header>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, subLabel }: { icon: React.ReactNode, label: string, value: string, subLabel?: string }) {
  return (
    <div className="bg-zinc-800/50 p-4 rounded-3xl border border-white/5 text-left group hover:border-emerald-500/30 transition-colors">
      <div className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <p className="text-[9px] text-gray-500 font-black uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-black text-white italic leading-tight">{value}</p>
      {subLabel && <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">{subLabel}</p>}
    </div>
  );
}
