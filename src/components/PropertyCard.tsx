
import React from 'react';
import { Property } from '@/services/localStorage';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, MessageCircle, Send } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      casa: 'Casa',
      apartamento: 'Apartamento',
      residencia: 'Residencia'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getOperationLabel = (operation: string) => {
    const labels = {
      venta: 'En Venta',
      alquiler: 'En Alquiler'
    };
    return labels[operation as keyof typeof labels] || operation;
  };

  const handleWhatsAppContact = () => {
    const message = `Hola! Me interesa la propiedad: ${property.title}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${property.contact.whatsapp.replace('+', '')}?text=${encodedMessage}`, '_blank');
  };

  const handleTelegramContact = () => {
    const message = `Hola! Me interesa la propiedad: ${property.title}`;
    window.open(`https://t.me/${property.contact.telegram.replace('@', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border-primary-100">
      <div className="relative">
        <img
          src={property.images[0] || '/placeholder.svg'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge 
            variant="secondary" 
            className={`${property.operation === 'venta' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
          >
            {getOperationLabel(property.operation)}
          </Badge>
          <Badge variant="outline" className="bg-white/90 text-primary-700 border-primary-300">
            {getTypeLabel(property.type)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>
          <p className="text-2xl font-bold text-primary-600">
            {formatPrice(property.price)}
            {property.operation === 'alquiler' && <span className="text-sm text-gray-500 font-normal">/mes</span>}
          </p>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area}m²</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {property.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-primary-50 text-primary-700">
              {feature}
            </Badge>
          ))}
          {property.features.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
              +{property.features.length - 3} más
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={handleWhatsAppContact}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
        <Button
          onClick={handleTelegramContact}
          variant="outline"
          className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
          size="sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Telegram
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
