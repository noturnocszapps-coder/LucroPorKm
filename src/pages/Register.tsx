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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-3xl mb-6">
            <Sparkles size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Criar sua conta</h1>
          <p className="text-gray-400 text-sm mt-2">Comece a controlar seus lucros de forma profissional e simples.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <Input 
            label="Melhor E-mail" 
            type="email" 
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
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
          />

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-red-400">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            isLoading={loading} 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Criando Conta...' : 'Criar Minha Conta'}
          </Button>
        </form>

        <p className="text-center mt-10 text-sm text-gray-500 uppercase tracking-widest text-[10px] font-semibold">
          Já tem conta? <Link to="/login" className="text-emerald-500 hover:underline">Faça login</Link>
        </p>

        <footer className="mt-20 text-center opacity-20">
          <p className="text-[10px] uppercase font-bold tracking-tighter">NT Aplicações — 2026</p>
        </footer>
      </div>
    </div>
  );
}
