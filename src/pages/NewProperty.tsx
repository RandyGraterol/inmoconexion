
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyService, UserService } from '@/services/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, ArrowLeft } from 'lucide-react';

const NewProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: '',
    operation: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    whatsapp: '',
    telegram: '',
    features: ''
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
  }, [navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.type || !formData.operation) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      PropertyService.createProperty({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type as 'casa' | 'apartamento' | 'residencia',
        operation: formData.operation as 'venta' | 'alquiler',
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
        location: formData.location,
        images: ["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop"],
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        contact: {
          whatsapp: formData.whatsapp,
          telegram: formData.telegram
        }
      });

      toast({
        title: "Propiedad creada",
        description: "La propiedad ha sido registrada exitosamente",
      });

      navigate('/dashboard/properties');
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al crear la propiedad",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-6">
              <SidebarTrigger />
              <Button variant="outline" onClick={() => navigate('/dashboard/properties')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Nueva Propiedad</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Registrar Nueva Propiedad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Precio *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo de Propiedad *</Label>
                      <Select onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casa">Casa</SelectItem>
                          <SelectItem value="apartamento">Apartamento</SelectItem>
                          <SelectItem value="residencia">Residencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="operation">Operación *</Label>
                      <Select onValueChange={(value) => handleInputChange('operation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar operación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="venta">Venta</SelectItem>
                          <SelectItem value="alquiler">Alquiler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Habitaciones</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Baños</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">Área (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telegram">Telegram</Label>
                      <Input
                        id="telegram"
                        value={formData.telegram}
                        onChange={(e) => handleInputChange('telegram', e.target.value)}
                        placeholder="@usuario"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="features">Características (separadas por comas)</Label>
                    <Input
                      id="features"
                      value={formData.features}
                      onChange={(e) => handleInputChange('features', e.target.value)}
                      placeholder="Jardín, Piscina, Garaje, etc."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Propiedad
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default NewProperty;
