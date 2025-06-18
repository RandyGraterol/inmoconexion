
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserService } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Home, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = UserService.login(email, password);
      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión como ${user.name}`,
      });
      
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Home className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-primary-800">CasaAzul</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Accede a tu cuenta para continuar</p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Bienvenido</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                  Regístrate aquí
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 p-4 bg-white rounded-lg shadow border border-primary-100">
          <h3 className="font-semibold text-gray-900 mb-2">Cuentas de prueba:</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Admin:</strong> admin@admin.com / admin123</p>
            <p><strong>Usuario:</strong> usuario@test.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
