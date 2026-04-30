import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Input, Button } from '../components/UI';
import { User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-3xl mb-6">
            <User size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta!</h1>
          <p className="text-gray-400 text-sm mt-2">Entre na sua conta para acompanhar seu lucro.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Seu E-mail" 
            type="email" 
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="space-y-1">
            <Input 
              label="Senha" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to="/forgot-password" size={12} className="text-[10px] text-gray-500 hover:text-emerald-500 uppercase tracking-widest font-semibold ml-1">
              Esqueci a senha
            </Link>
          </div>

          {error && <p className="text-xs font-medium text-red-400 text-center uppercase tracking-tighter">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full">
            Entrar no Painel
          </Button>
        </form>

        <p className="text-center mt-10 text-sm text-gray-500 uppercase tracking-widest text-[10px] font-semibold">
          Novo por aqui? <Link to="/register" className="text-emerald-500 hover:underline">Crie sua conta</Link>
        </p>
      </div>
    </div>
  );
}
