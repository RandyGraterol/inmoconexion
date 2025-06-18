
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserService } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = UserService.getCurrentUser();

  const handleLogout = () => {
    UserService.logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md border-b border-primary-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-primary-800">InmoConexión</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link 
              to="/#propiedades" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Propiedades
            </Link>
            {currentUser?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-primary-300 text-primary-700 hover:bg-primary-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="border-primary-300 text-primary-700 hover:bg-primary-50"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Registrarse
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
