import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Environment variables injected via Vite
  const user1 = import.meta.env.VITE_USER1;
  const pass1 = import.meta.env.VITE_PASS1;
  const user2 = import.meta.env.VITE_USER2;
  const pass2 = import.meta.env.VITE_PASS2;

  const handleAutoFill = (u: string, p: string) => {
    setEmail(u);
    setPassword(p);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error, message } = await api.post({
      url: '/auth/login',
      data: { email, password },
    });

    setLoading(false);

    if (error) {
      toast.error(message);
    } else {
      toast.success('Código OTP enviado para o seu e-mail.');
      navigate('/verify-otp', { state: { email } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Aceder à conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-blue-500 hover:text-blue-400">
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* Dev/Demo Login Buttons */}
        {(user1 || user2) && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {user1 && pass1 && (
              <button
                type="button"
                onClick={() => handleAutoFill(user1, pass1 as string)}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logar {user1.split('@')[0]}
              </button>
            )}
            {user2 && pass2 && (
              <button
                type="button"
                onClick={() => handleAutoFill(user2, pass2 as string)}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logar {user2.split('@')[0]}
              </button>
            )}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label className="text-gray-300 text-sm font-bold mb-2 block">E-mail</label>
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-300 text-sm font-bold mb-2 block">Senha</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Validando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
