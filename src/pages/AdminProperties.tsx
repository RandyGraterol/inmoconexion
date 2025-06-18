
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyService, UserService } from '@/services/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import { Building, Edit, Trash2, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    loadProperties();
  }, [navigate, toast]);

  const loadProperties = () => {
    const loadedProperties = PropertyService.getProperties();
    setProperties(loadedProperties);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      PropertyService.deleteProperty(id);
      loadProperties();
      toast({
        title: "Propiedad eliminada",
        description: "La propiedad ha sido eliminada exitosamente",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Propiedades</h1>
              </div>
              <Button onClick={() => navigate('/dashboard/new-property')}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Propiedad
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Lista de Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay propiedades registradas. ¡Crea la primera!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Operación</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>{property.type}</TableCell>
                          <TableCell>
                            <Badge variant={property.operation === 'venta' ? 'default' : 'secondary'}>
                              {property.operation}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatPrice(property.price)}</TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDelete(property.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminProperties;
