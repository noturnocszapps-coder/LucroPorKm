import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Input, Button } from '../components/UI';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mapeamento de erros do Firebase para Português
  const mapAuthErrorToMessage = (error: AuthError) => {
    console.error('DEBUG: Auth Error Code:', error.code);
    console.error('DEBUG: Full Error:', error);

    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso por outro motorista.';
      case 'auth/invalid-email':
        return 'O endereço de e-mail informado não é válido.';
      case 'auth/operation-not-allowed':
        return 'O cadastro com e-mail/senha não está habilitado no Firebase.';
      case 'auth/weak-password':
        return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet.';
      default:
        return `Ocorreu um erro inesperado: ${error.message}`;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset estados
    setLoading(true);
    setError('');

    console.log('DEBUG: Iniciando processo de cadastro para:', email);

    try {
      // 1. Criar usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('DEBUG: Usuário criado no Auth com UID:', user.uid);

      // 2. Criar documento de perfil no Firestore (Coleção PROFILES conforme solicitado)
      // Usamos setDoc para garantir que o ID do documento seja o UID do usuário
      try {
        await setDoc(doc(db, 'profiles', user.uid), {
          userId: user.uid,
          email: email.toLowerCase(),
          onboardingCompleted: false,
          created_at: serverTimestamp(), // Melhor prática: usar timestamp do servidor
          isPremium: false,
          vehicleName: '',
          avgConsumption: 0,
          fuelPrice: 0,
          fixedCostsMonthly: 0,
          maintenanceMonthly: 0
        });
        console.log('DEBUG: Documento de perfil criado com sucesso na coleção "profiles"');
        
        // 3. Redirecionar para onboarding
        navigate('/onboarding');
      } catch (firestoreError: any) {
        console.error('DEBUG: Erro ao criar documento no Firestore:', firestoreError);
        setError('Conta criada, mas houve um erro ao salvar seu perfil. Tente fazer login.');
      }

    } catch (err: any) {
      const message = mapAuthErrorToMessage(err as AuthError);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-6 bg-zinc-900 rounded-[32px] mb-8 border border-white/5 shadow-2xl relative"
          >
             <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
             <Sparkles size={40} className="text-emerald-500 relative z-10" />
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-tight">
            Criar sua conta
          </h1>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-3 font-black uppercase tracking-[0.3em] italic leading-relaxed">
            Comece a controlar seus lucros de forma profissional.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          <Input 
            label="Melhor E-mail" 
            type="email" 
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            className="bg-zinc-900/50 backdrop-blur-xl h-14"
          />
          <Input 
            label="Escolha uma Senha" 
            type="password" 
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            disabled={loading}
            className="bg-zinc-900/50 backdrop-blur-xl h-14"
          />

          {error && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-2"
             >
               <AlertCircle size={16} className="text-red-500 shrink-0" />
               <p className="text-[10px] font-black text-red-400 uppercase italic tracking-[0.05em]">{error}</p>
             </motion.div>
          )}

          <Button 
            type="submit" 
            isLoading={loading} 
            className="w-full h-16 text-sm font-black uppercase tracking-[0.2em] italic rounded-[24px] bg-emerald-500 text-black shadow-2xl shadow-emerald-500/10 active:scale-95 transition-all"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Iniciar Jornada'}
          </Button>
        </form>

        <p className="text-center mt-12 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black italic">
          Já tem conta? <Link to="/login" className="text-emerald-500 hover:underline px-2">Acessar Painel</Link>
        </p>

        <footer className="mt-20 text-center opacity-30">
          <p className="text-[9px] uppercase font-black italic tracking-[0.3em]">Lucro por KM © 2026</p>
        </footer>
      </div>
    </div>
  );
}
