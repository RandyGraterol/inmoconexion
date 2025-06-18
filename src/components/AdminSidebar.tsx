
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  Home, 
  Plus, 
  Building, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { UserService } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentUser = UserService.getCurrentUser();

  const handleLogout = () => {
    UserService.logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    navigate('/');
  };

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Ver Propiedades",
      url: "/dashboard/properties",
      icon: Building,
    },
    {
      title: "Nueva Propiedad",
      url: "/dashboard/new-property",
      icon: Plus,
    },
    {
      title: "Configuración",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Building className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-lg font-bold text-primary-800">InmoConexión</h1>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Usuario</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <User className="h-4 w-4" />
                  <span>{currentUser?.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
