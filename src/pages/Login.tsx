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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -mr-64 -mb-64" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-6 bg-zinc-900 rounded-[32px] mb-8 border border-white/5 shadow-2xl relative"
          >
             <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
             <User size={40} className="text-emerald-500 relative z-10" />
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-tight">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-3 font-black uppercase tracking-[0.3em] italic">
            O lucro real começa pelo controle.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <Input 
            label="Seu E-mail" 
            type="email" 
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-900/50 backdrop-blur-xl h-14"
          />
          <div className="space-y-2">
            <Input 
              label="Sua Senha" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-900/50 backdrop-blur-xl h-14"
            />
            <div className="flex justify-start pl-1">
              <Link to="/forgot-password" size={12} className="text-[9px] text-gray-500 hover:text-emerald-500 uppercase tracking-widest font-black italic transition-colors">
                Esqueci a senha
              </Link>
            </div>
          </div>

          {error && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl"
             >
               <p className="text-[10px] font-black text-red-400 text-center uppercase italic tracking-widest">{error}</p>
             </motion.div>
          )}

          <Button 
            type="submit" 
            isLoading={loading} 
            className="w-full h-16 text-sm font-black uppercase tracking-[0.2em] italic rounded-[24px] bg-emerald-500 text-black shadow-2xl shadow-emerald-500/10 active:scale-95 transition-all"
          >
            Acessar Painel
          </Button>
        </form>

        <p className="text-center mt-12 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black italic">
          Novo por aqui? <Link to="/register" className="text-emerald-500 hover:underline px-2">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  );
}
