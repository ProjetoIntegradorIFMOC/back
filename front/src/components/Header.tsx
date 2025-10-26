import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Code2, LogOut } from "lucide-react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import axios from "axios";
import Cookies from "js-cookie";
import Notification from "./Notification";

// Define as rotas de navegação do menu
interface NavigationItem {
  to: string;
  label: string;
}

const navigationItems: NavigationItem[] = [
  { to: "/home", label: "Dashboard" },
  { to: "/activities", label: "Atividades" },
  { to: "/submissions", label: "Submissões" },
];

export default function Header() {
  // Estado para controlar o menu mobile aberto/fechado
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Hook para saber qual rota está ativa
  const location = useLocation();

  // Alterna o menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fecha o menu mobile
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Retorna se a rota está ativa
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigate = useNavigate();

  async function handleLogout() {
    try {

      await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
        },
        withCredentials: true
      });
      localStorage.removeItem("auth_token");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout", error);
      setError(true)
      setErrorMsg("Erro ao fazer logout. Tente novamente mais tarde.")
    }
  }

  return (
    <>
      {error && <Notification type="error" message={errorMsg} onClose={() => { setError(false); setErrorMsg(""); }} />}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e nome do app */}
            <div className="flex-shrink-0">
              <Link
                to="/home"
                className="flex items-center space-x-2 group"
                onClick={closeMobileMenu}
              >
                <div className="relative">
                  {/* Efeito gradiente atrás do ícone */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-gray-900 text-xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  IFCode
                </span>
              </Link>
            </div>

            {/* Menu de navegação (desktop) */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex space-x-1">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.to}>
                    <Link
                      to={item.to}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isActiveRoute(item.to)
                          ? "text-blue-600 bg-blue-50 shadow-sm"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                      {/* Barra decorativa se está ativo */}
                      {isActiveRoute(item.to) && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                      )}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
              <button
                onClick={handleLogout}
                className={`relative flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  bg-gradient-to-r from-red-500 to-pink-500
                  border border-red-600
                  text-white
                  shadow-sm
                  hover:from-red-600 hover:to-pink-600
                  hover:border-red-700
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                  cursor-pointer
                `}
              >
                <LogOut className="w-5 h-5" />
                Sair
                {/* Barra decorativa igual aos outros botões, mas vermelha */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
              </button>
            </NavigationMenu>
            {/* Botão hamburguer para abrir/fechar menu mobile */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="relative inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 group"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {/* Efeito gradiente de fundo no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                {/* Ícone de X se aberto, hambúrguer se fechado */}
                {isMobileMenuOpen ? (
                  <X className="relative h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="relative h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Menu mobile (aparece só no mobile) W.I.P*/}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
              <div className="px-2 pt-3 pb-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isActiveRoute(item.to)
                        ? "text-blue-600 bg-blue-50 shadow-sm border-l-4 border-blue-600"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <span className="flex-1">{item.label}</span>
                    {/* Bolinha colorida se está ativo */}
                    {isActiveRoute(item.to) && (
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    )}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className={`w-full relative flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                    text-red-700 bg-red-500/10 shadow-sm border-l-4 border-red-600
                    hover:bg-red-500/20 hover:border-red-700
                    cursor-pointer
                  `}
                >
                  <span className="flex-1 text-left">Sair</span>
                  <LogOut className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
