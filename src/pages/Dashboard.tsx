
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyService, UserService } from '@/services/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'casa' as Property['type'],
    operation: 'venta' as Property['operation'],
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    images: '',
    features: '',
    whatsapp: '',
    telegram: ''
  });

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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      type: 'casa',
      operation: 'venta',
      bedrooms: '',
      bathrooms: '',
      area: '',
      location: '',
      images: '',
      features: '',
      whatsapp: '+1234567890',
      telegram: '@realestate'
    });
    setEditingProperty(null);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      type: property.type,
      operation: property.operation,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      location: property.location,
      images: property.images.join(', '),
      features: property.features.join(', '),
      whatsapp: property.contact.whatsapp,
      telegram: property.contact.telegram
    });
    setIsDialogOpen(true);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      type: formData.type,
      operation: formData.operation,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseFloat(formData.area),
      location: formData.location,
      images: formData.images.split(',').map(img => img.trim()).filter(img => img),
      features: formData.features.split(',').map(feature => feature.trim()).filter(feature => feature),
      contact: {
        whatsapp: formData.whatsapp,
        telegram: formData.telegram
      }
    };

    try {
      if (editingProperty) {
        PropertyService.updateProperty(editingProperty.id, propertyData);
        toast({
          title: "Propiedad actualizada",
          description: "La propiedad ha sido actualizada exitosamente",
        });
      } else {
        PropertyService.createProperty(propertyData);
        toast({
          title: "Propiedad creada",
          description: "La propiedad ha sido creada exitosamente",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadProperties();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar la propiedad",
        variant: "destructive",
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - Administrar Propiedades</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Propiedad
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={(value: Property['type']) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="residencia">Residencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="operation">Operación</Label>
                    <Select value={formData.operation} onValueChange={(value: Property['operation']) => setFormData({...formData, operation: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venta">Venta</SelectItem>
                        <SelectItem value="alquiler">Alquiler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Habitaciones</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Baños</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">Área (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="images">URLs de Imágenes (separadas por comas)</Label>
                    <Input
                      id="images"
                      value={formData.images}
                      onChange={(e) => setFormData({...formData, images: e.target.value})}
                      placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="features">Características (separadas por comas)</Label>
                    <Input
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      placeholder="Jardín, Piscina, Garaje, Balcón"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      placeholder="+1234567890"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input
                      id="telegram"
                      value={formData.telegram}
                      onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                      placeholder="@usuario"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    {editingProperty ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Propiedades Registradas ({properties.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {property.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={property.operation === 'venta' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {property.operation}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPrice(property.price)}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(property)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {properties.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay propiedades registradas. ¡Crea la primera!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
