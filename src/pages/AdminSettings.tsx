
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '@/services/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import { Settings, User, Lock } from 'lucide-react';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(UserService.getCurrentUser());
  const [userForm, setUserForm] = useState({
    name: '',
    email: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const user = UserService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      toast({
        title: "Acceso denegado",
        description: "Necesitas permisos de administrador para acceder",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    if (user) {
      setUserForm({
        name: user.name,
        email: user.email
      });
    }
  }, [navigate, toast]);

  const handleUserUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.name || !userForm.email) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (currentUser) {
      const users = UserService.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], name: userForm.name, email: userForm.email };
        UserService.saveUsers(users);
        UserService.setCurrentUser(users[userIndex]);
        setCurrentUser(users[userIndex]);
        
        toast({
          title: "Datos actualizados",
          description: "Tu información ha sido actualizada exitosamente",
        });
      }
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos de contraseña",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (currentUser) {
      const storedPassword = localStorage.getItem(`password_${currentUser.id}`);
      
      if (storedPassword !== passwordForm.currentPassword) {
        toast({
          title: "Error",
          description: "La contraseña actual es incorrecta",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem(`password_${currentUser.id}`, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-6">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información Personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUserUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={userForm.name}
                        onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Actualizar Información
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Cambiar Contraseña */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Cambiar Contraseña
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Contraseña Actual</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Cambiar Contraseña
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Información del Sistema */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Información del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Usuario:</strong> {currentUser?.name}
                  </div>
                  <div>
                    <strong>Rol:</strong> {currentUser?.role}
                  </div>
                  <div>
                    <strong>Registro:</strong> {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminSettings;
