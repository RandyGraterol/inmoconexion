
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyService, UserService } from '@/services/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import { Home, Building, DollarSign, Eye } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
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

  const getStats = () => {
    const total = properties.length;
    const forSale = properties.filter(p => p.operation === 'venta').length;
    const forRent = properties.filter(p => p.operation === 'alquiler').length;
    const totalValue = properties
      .filter(p => p.operation === 'venta')
      .reduce((sum, p) => sum + p.price, 0);

    return { total, forSale, forRent, totalValue };
  };

  const getChartData = () => {
    // Datos para gráfica de pastel (tipos de propiedad)
    const typeData = [
      { name: 'Casas', value: properties.filter(p => p.type === 'casa').length, fill: '#3b82f6' },
      { name: 'Apartamentos', value: properties.filter(p => p.type === 'apartamento').length, fill: '#06b6d4' },
      { name: 'Residencias', value: properties.filter(p => p.type === 'residencia').length, fill: '#0ea5e9' }
    ];

    // Datos para gráfica de barras (operaciones)
    const operationData = [
      { name: 'Venta', value: properties.filter(p => p.operation === 'venta').length, fill: '#3b82f6' },
      { name: 'Alquiler', value: properties.filter(p => p.operation === 'alquiler').length, fill: '#06b6d4' }
    ];

    return { typeData, operationData };
  };

  const stats = getStats();
  const chartData = getChartData();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const chartConfig = {
    value: {
      label: "Cantidad",
    },
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex-1 p-3 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Principal</h1>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Propiedades</CardTitle>
                  <Building className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Propiedades registradas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">En Venta</CardTitle>
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stats.forSale}</div>
                  <p className="text-xs text-muted-foreground">Disponibles para venta</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">En Alquiler</CardTitle>
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stats.forRent}</div>
                  <p className="text-xs text-muted-foreground">Disponibles para alquiler</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Valor Total</CardTitle>
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{formatPrice(stats.totalValue)}</div>
                  <p className="text-xs text-muted-foreground">En propiedades de venta</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section - Responsive */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Distribución por Tipo de Propiedad</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.typeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius="70%"
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Propiedades por Operación</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.operationData}>
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          interval={0}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Properties - Responsive */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Propiedades Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {properties.slice(0, 5).map((property) => (
                    <div key={property.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm sm:text-base">{property.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{property.location}</p>
                      </div>
                      <div className="flex flex-row sm:items-center space-x-3">
                        <Badge variant={property.operation === 'venta' ? 'default' : 'secondary'} className="text-xs">
                          {property.operation}
                        </Badge>
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base">{formatPrice(property.price)}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{property.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      No hay propiedades registradas. ¡Crea la primera!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
