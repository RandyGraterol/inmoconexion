
import React, { useState, useEffect } from 'react';
import { Property, PropertyService } from '@/services/localStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import PropertyCard from '@/components/PropertyCard';
import Header from '@/components/Header';
import { Search, Filter, MapPin, Home as HomeIcon, Building, Building2 } from 'lucide-react';

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    operation: '',
    location: ''
  });

  useEffect(() => {
    // Inicializar datos de muestra si no existen
    PropertyService.initializeSampleData();
    loadProperties();
    
    // Configurar polling para sincronización automática
    const interval = setInterval(loadProperties, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const loadProperties = () => {
    const loadedProperties = PropertyService.getProperties();
    setProperties(loadedProperties);
  };

  const applyFilters = () => {
    let filtered = properties;

    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    if (filters.operation) {
      filtered = filtered.filter(property => property.operation === filters.operation);
    }

    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      operation: '',
      location: ''
    });
  };

  const getPropertyStats = () => {
    const totalProperties = properties.length;
    const forSale = properties.filter(p => p.operation === 'venta').length;
    const forRent = properties.filter(p => p.operation === 'alquiler').length;
    const houses = properties.filter(p => p.type === 'casa').length;
    const apartments = properties.filter(p => p.type === 'apartamento').length;
    const residences = properties.filter(p => p.type === 'residencia').length;

    return { totalProperties, forSale, forRent, houses, apartments, residences };
  };

  const stats = getPropertyStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Encuentra tu Hogar Ideal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Conectamos personas con propiedades perfectas. 
              Tu nuevo hogar te está esperando en InmoConexión.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
                <div className="text-blue-100">Propiedades</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.forSale}</div>
                <div className="text-blue-100">En Venta</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.forRent}</div>
                <div className="text-blue-100">En Alquiler</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.houses + stats.apartments + stats.residences}</div>
                <div className="text-blue-100">Tipos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b shadow-sm -mt-8 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar propiedades..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="residencia">Residencia</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.operation} onValueChange={(value) => handleFilterChange('operation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Operación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Ubicación"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="whitespace-nowrap"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Properties Section */}
      <section id="propiedades" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Propiedades Destacadas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explora nuestra selección de propiedades cuidadosamente elegidas
            </p>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              Mostrando {filteredProperties.length} de {properties.length} propiedades
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <HomeIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Busca por Categoría
            </h2>
            <p className="text-lg text-gray-600">
              Encuentra exactamente lo que buscas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleFilterChange('type', 'casa')}>
              <CardContent className="p-8 text-center">
                <HomeIcon className="h-16 w-16 text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Casas</h3>
                <p className="text-gray-600 mb-4">Hogares espaciosos con jardín</p>
                <div className="text-2xl font-bold text-primary-600">{stats.houses}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleFilterChange('type', 'apartamento')}>
              <CardContent className="p-8 text-center">
                <Building className="h-16 w-16 text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Apartamentos</h3>
                <p className="text-gray-600 mb-4">Vida urbana moderna</p>
                <div className="text-2xl font-bold text-primary-600">{stats.apartments}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleFilterChange('type', 'residencia')}>
              <CardContent className="p-8 text-center">
                <Building2 className="h-16 w-16 text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Residencias</h3>
                <p className="text-gray-600 mb-4">Lujo y exclusividad</p>
                <div className="text-2xl font-bold text-primary-600">{stats.residences}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <HomeIcon className="h-8 w-8" />
              <span className="text-2xl font-bold">InmoConexión</span>
            </div>
            <p className="text-blue-100 mb-6">
              Tu plataforma de confianza para conectar con el hogar perfecto
            </p>
            <div className="border-t border-primary-700 pt-8">
              <p className="text-blue-200">
                © 2024 InmoConexión. Todos los derechos reservados. Sistema educativo.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
