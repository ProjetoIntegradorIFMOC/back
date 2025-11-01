import { useUser } from "../../context/UserContext"; // Caminho de importação corrigido (Assumindo src/pages/ -> src/ -> context/)
import { User, Mail, Zap, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

//interface do usuário
interface UserData {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export default function ProfileView() {
  // O hook useUser é usado para obter os dados do usuário logado
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  // Simula um tempo de carregamento para a página ser mais robusta
  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      // Se o 'user' ainda for null, aguarda mais um pouco
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const userData = user as UserData | null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="ml-3 text-lg text-gray-600">A carregar perfil...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold text-red-600">
          Erro: Perfil não encontrado
        </h1>
        <p className="mt-2 text-gray-600">
          Por favor, tente iniciar a sessão novamente.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10">
        {/* Header do Perfil */}
        <div className="flex items-center space-x-6 border-b pb-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
            {userData.name ? (
              userData.name[0].toUpperCase()
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {userData.name || `Usuário #${userData.id}`}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie os seus dados e permissões.
            </p>
          </div>
        </div>

        {/* Informações de Detalhe */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-purple-700 border-b pb-2 mb-4">
            Detalhes da Conta
          </h2>

          {/* Campo Email */}
          <div className="flex items-center p-4 bg-purple-50 rounded-lg shadow-sm border border-purple-200">
            <Mail className="w-5 h-5 text-purple-600 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {userData.email}
              </p>
            </div>
          </div>

          {/* Campo permissões*/}
          <div className="p-4 bg-indigo-50 rounded-lg shadow-sm border border-indigo-200">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-indigo-600 mr-3" />
              <h3 className="text-lg font-medium text-indigo-700">
                Permissões
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {userData.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 text-sm font-semibold rounded-full bg-indigo-200 text-indigo-800 shadow-sm"
                >
                  {/* Mantendo o texto em inglês por segurança na codificação, se for uma propriedade do sistema */}
                  {role.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* opcao para mudar a senha*/}
          <div className="pt-4 border-t mt-6">
            <a
              href="/change-password"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Alterar Senha
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
