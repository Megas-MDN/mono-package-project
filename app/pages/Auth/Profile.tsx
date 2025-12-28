import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useZUserProfile } from '../../stores/useZUserProfile';
import { toast } from 'react-toastify';

export const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { resetAll } = useZUserProfile();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await api.get<any>({
        url: '/auth/me',
      });

      if (error) {
        toast.error('Sessão expirada ou inválida');
        handleLogout();
      } else {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@fabricjs:token');
    resetAll();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
            >
              Sair
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Nome</label>
                <p className="text-xl font-semibold">{userData?.name || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">E-mail</label>
                <p className="text-xl font-semibold">{userData?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Último Login</label>
                <p className="text-lg">
                  {userData?.lastLoginDate 
                    ? new Date(userData.lastLoginDate).toLocaleString('pt-BR') 
                    : 'Primeiro acesso'}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">ID do Socket</label>
                <p className="font-mono text-blue-400">
                  {userData?.socketId || 'Desconectado'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
            <h3 className="text-blue-400 font-bold mb-2">Informação de Segurança</h3>
            <p className="text-gray-300 text-sm">
              Seu token JWT está sendo enviado de forma segura em todas as requisições. 
              O payload do token é criptografado e só pode ser lido pelo servidor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
