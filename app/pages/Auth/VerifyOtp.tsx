import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { useZUserProfile } from '../../stores/useZUserProfile';

export const VerifyOtp: React.FC = () => {
  const { setUser } = useZUserProfile();
  
  // Auto-fill OTP in development
  const isDev = import.meta.env.VITE_DEV_MODE_SKIP_OTP === 'true';
  const [otp, setOtp] = useState(isDev ? '000000' : '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error, message, data } = await api.post<any>({
      url: '/auth/verify-otp',
      data: { email, otp },
    });

    setLoading(false);

    if (error) {
      toast.error(message);
    } else {
      toast.success('Login realizado com sucesso!');
      
      // Save token in store (which persists to userProfile in localStorage)
      // And also save to @fabricjs:token for the api.ts
      localStorage.setItem('@fabricjs:token', data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.name,
        token: data.token
      });

      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Verificação OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enviamos um código de 6 dígitos para <span className="text-blue-400 font-medium">{email}</span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label className="text-gray-300 text-sm font-bold mb-2 block text-center">Digite o código</label>
              <input
                type="text"
                required
                maxLength={6}
                className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-gray-600 bg-gray-700 text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Confirmar Código'}
            </button>
          </div>
          <div className="text-center">
            <button 
              type="button"
              className="text-sm text-gray-400 hover:text-white transition-colors"
              onClick={() => navigate('/login')}
            >
              Voltar para o login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
