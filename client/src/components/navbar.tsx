import { useAuth } from "@/hooks/use-auth";
import { requestOpenBettingModal } from "@/lib/betting-modal";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Home, Zap, Trophy, User, Shield } from "lucide-react";
import { requestOpenDepositDialog } from "@/components/direct-deposit-dialog";
import { useQuery } from "@tanstack/react-query";
import { SystemSettings } from "@/types";

interface NavLinkProps {
  href?: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}

function NavLink({ href, active, children, onClick, icon }: NavLinkProps) {
  const [, navigate] = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${active
        ? 'bg-white/20 text-white shadow-md backdrop-blur-sm'
        : 'text-white/90 hover:bg-white/10 hover:text-white'
        }`}
    >
      {icon}
      {children}
    </button>
  );
}

export function Navbar() {
  const { user, logoutMutation, isLoading: authLoading } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch system settings for colors - always get fresh data
  const { data: systemSettings } = useQuery<SystemSettings>({
    queryKey: ["/api/settings"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/auth');
  };

  // Use CSS variables directly to avoid flickering
  // The variables --primary and --primary-dark are set by initializeTheme() before hydration
  const navStyle: React.CSSProperties = {
    background: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary-dark)))`,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  };

  return (
    <nav style={navStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <img src="/img/logo.png" alt="Logo" className="h-10 w-auto" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink
                href="/"
                active={location === "/"}
                icon={<Home className="h-4 w-4" />}
              >
                Início
              </NavLink>
              {user && (
                <NavLink
                  href="/user-dashboard"
                  active={location === "/user-dashboard"}
                  icon={<Zap className="h-4 w-4" />}
                >
                  Apostar
                </NavLink>
              )}
              <NavLink
                href="/results"
                active={location === "/results"}
                icon={<Trophy className="h-4 w-4" />}
              >
                Resultados
              </NavLink>
              {user && (
                <NavLink
                  href="/user-dashboard"
                  active={location === "/user-dashboard"}
                  icon={<User className="h-4 w-4" />}
                >
                  Painel
                </NavLink>
              )}
              {user?.isAdmin && (
                <NavLink
                  href="/admin-dashboard"
                  active={location === "/admin-dashboard"}
                  icon={<Shield className="h-4 w-4" />}
                >
                  Administrador
                </NavLink>
              )}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {authLoading ? (
              // Loading State - Placeholder sem piscar
              <div className="flex items-center gap-3 opacity-50">
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center text-white border border-white/30">
                    <span className="font-bold">R$ {user.balance.toFixed(2)}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-md hover:shadow-lg transition-all"
                    onClick={() => requestOpenDepositDialog()}
                  >
                    Depositar
                  </Button>
                </div>

                <div className="h-8 w-px bg-white/30"></div>

                <span className="text-sm text-white font-medium">
                  {user.name || user.username}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm font-semibold"
                >
                  Entrar
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/auth?tab=register")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Cadastrar
                </Button>
              </>
            )}
          </div>

          {/* Mobile Right Side Container */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Right Side Actions */}
            <div className="flex items-center gap-2">
              {authLoading ? (
                <div className="h-7 w-16 bg-white/20 rounded animate-pulse"></div>
              ) : user ? (
                <>
                  <div className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1.5 rounded-lg flex items-center text-white border border-white/30">
                    <span className="font-bold">R$ {user.balance.toFixed(2)}</span>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-sm"
                    onClick={() => requestOpenDepositDialog()}
                  >
                    Depositar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="h-8 px-3 text-xs bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold border border-white/30 shadow-sm"
                  >
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate("/auth?tab=register")}
                    className="h-8 px-3 text-xs bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-sm"
                  >
                    Cadastrar
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/20 backdrop-blur-md border-t border-white/10">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-base font-medium text-white bg-white/10"
            >
              <Home className="h-4 w-4" />
              Início
            </button>

            {user && (
              <button
                onClick={() => {
                  navigate("/user-dashboard");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:text-white hover:bg-white/10"
              >
                <Zap className="h-4 w-4" />
                Apostar
              </button>
            )}

            <button
              onClick={() => {
                navigate("/results");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:text-white hover:bg-white/10"
            >
              <Trophy className="h-4 w-4" />
              Resultados
            </button>

            {user && (
              <button
                onClick={() => {
                  navigate("/user-dashboard");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:text-white hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                Painel
              </button>
            )}

            {user?.isAdmin && (
              <button
                onClick={() => {
                  navigate("/admin-dashboard");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:text-white hover:bg-white/10"
              >
                <Shield className="h-4 w-4" />
                Administrador
              </button>
            )}

            {user && (
              <>
                <div className="pt-4 pb-3 border-t border-white/10">
                  <div className="flex items-center px-3 mb-3">
                    <div className="text-base font-medium text-white">{user.name || user.username}</div>
                  </div>

                  <button
                    className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sair
                  </button>
                </div>
              </>
            )}

            {!user && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Button
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold"
                  onClick={() => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                >
                  Entrar
                </Button>
                <Button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
                  onClick={() => {
                    navigate("/auth?tab=register");
                    setMobileMenuOpen(false);
                  }}
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}