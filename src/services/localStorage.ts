
// Tipos de datos
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'casa' | 'apartamento' | 'residencia';
  operation: 'venta' | 'alquiler';
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  images: string[];
  features: string[];
  contact: {
    whatsapp: string;
    telegram: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// Servicio de localStorage para usuarios
export class UserService {
  private static USERS_KEY = 'real_estate_users';
  private static CURRENT_USER_KEY = 'real_estate_current_user';

  static getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static createUser(email: string, password: string, name: string): User {
    const users = this.getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: email === 'admin@admin.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    // Guardar contraseña (en un sistema real esto sería hasheado)
    localStorage.setItem(`password_${newUser.id}`, password);
    
    return newUser;
  }

  static login(email: string, password: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const storedPassword = localStorage.getItem(`password_${user.id}`);
    if (storedPassword !== password) {
      throw new Error('Contraseña incorrecta');
    }

    this.setCurrentUser(user);
    return user;
  }

  static logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

// Servicio de localStorage para propiedades
export class PropertyService {
  private static PROPERTIES_KEY = 'real_estate_properties';

  static getProperties(): Property[] {
    const properties = localStorage.getItem(this.PROPERTIES_KEY);
    return properties ? JSON.parse(properties) : [];
  }

  static saveProperties(properties: Property[]): void {
    localStorage.setItem(this.PROPERTIES_KEY, JSON.stringify(properties));
  }

  static createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
    const properties = this.getProperties();
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    properties.push(newProperty);
    this.saveProperties(properties);
    return newProperty;
  }

  static updateProperty(id: string, propertyData: Partial<Property>): Property {
    const properties = this.getProperties();
    const index = properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Propiedad no encontrada');
    }

    properties[index] = {
      ...properties[index],
      ...propertyData,
      updatedAt: new Date().toISOString()
    };

    this.saveProperties(properties);
    return properties[index];
  }

  static deleteProperty(id: string): void {
    const properties = this.getProperties();
    const filteredProperties = properties.filter(p => p.id !== id);
    this.saveProperties(filteredProperties);
  }

  static getPropertyById(id: string): Property | null {
    const properties = this.getProperties();
    return properties.find(p => p.id === id) || null;
  }

  static searchProperties(filters: {
    type?: string;
    operation?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Property[] {
    const properties = this.getProperties();
    
    return properties.filter(property => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.operation && property.operation !== filters.operation) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      return true;
    });
  }

  // Método para inicializar datos de prueba
  static initializeSampleData(): void {
    const existingProperties = this.getProperties();
    if (existingProperties.length === 0) {
      const sampleProperties: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          title: "Casa Moderna en Zona Residencial",
          description: "Hermosa casa de dos plantas con acabados de lujo, jardín amplio y garaje para dos vehículos.",
          price: 250000,
          type: "casa",
          operation: "venta",
          bedrooms: 4,
          bathrooms: 3,
          area: 200,
          location: "Zona Norte, Ciudad",
          images: ["https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop"],
          features: ["Jardín", "Garaje", "Piscina", "Balcón", "Cocina moderna"],
          contact: {
            whatsapp: "+1234567890",
            telegram: "@realestate"
          }
        },
        {
          title: "Apartamento Céntrico Amueblado",
          description: "Moderno apartamento completamente amueblado en el centro de la ciudad, cerca de transporte público.",
          price: 800,
          type: "apartamento",
          operation: "alquiler",
          bedrooms: 2,
          bathrooms: 2,
          area: 80,
          location: "Centro, Ciudad",
          images: ["https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop"],
          features: ["Amueblado", "Aire acondicionado", "Balcón", "Ascensor"],
          contact: {
            whatsapp: "+1234567890",
            telegram: "@realestate"
          }
        },
        {
          title: "Residencia de Lujo con Vista al Mar",
          description: "Exclusiva residencia con vista panorámica al océano, acabados de primera y amplios espacios.",
          price: 500000,
          type: "residencia",
          operation: "venta",
          bedrooms: 5,
          bathrooms: 4,
          area: 350,
          location: "Costa Azul, Ciudad",
          images: ["https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=400&h=300&fit=crop"],
          features: ["Vista al mar", "Piscina", "Jardín", "Terraza", "Garaje", "Seguridad 24h"],
          contact: {
            whatsapp: "+1234567890",
            telegram: "@realestate"
          }
        }
      ];

      sampleProperties.forEach(property => {
        this.createProperty(property);
      });
    }
  }
}
