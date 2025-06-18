
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserService } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Home, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const user = UserService.createUser(formData.email, formData.password, formData.name);
      toast({
        title: "¡Registro exitoso!",
        description: `Bienvenido ${user.name}, tu cuenta ha sido creada`,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la cuenta",
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete a nuestra plataforma inmobiliaria</p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Registro</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Completa tus datos para crear tu cuenta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                  Inicia sesión aquí
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
