import React, { useState } from 'react';
import { User, Settings, LogOut, Edit, Camera, Mail, Phone, MapPin, Calendar, Star, Clock, FileText, Shield, Bell, Moon, Sun, ChevronRight } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Badge } from './ui/Badge';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: 'client' | 'technician';
  joinDate: Date;
  rating?: number;
  completedServices?: number;
  bio?: string;
  specialties?: string[];
  verificationStatus?: 'verified' | 'pending' | 'unverified';
}

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showProfile: boolean;
    showRating: boolean;
    showContact: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
  };
}

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  settings: UserSettings;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onLogout: () => void;
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    bio: user.bio,
  });

  // Handle profile edit
  const handleProfileEdit = () => {
    if (editMode) {
      // Save changes
      onUpdateProfile(editedProfile);
    }
    setEditMode(!editMode);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle settings change
  const handleSettingsChange = (section: keyof UserSettings, setting: string, value: boolean | string) => {
    onUpdateSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [setting]: value,
      },
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="md"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Mi Perfil</h2>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-neutral-600 hover:text-danger-500"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 p-1 mx-4 mt-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <Avatar 
                    src={user.avatar} 
                    alt={user.name}
                    size="xl"
                  />
                  {editMode && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full p-1 h-8 w-8"
                      aria-label="Cambiar foto"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleInputChange}
                    className="text-xl font-semibold text-center border-b border-neutral-300 pb-1 focus:outline-none focus:border-primary-500"
                  />
                ) : (
                  <h1 className="text-xl font-semibold">{user.name}</h1>
                )}
                
                <div className="flex items-center justify-center mt-1 space-x-1">
                  <Badge 
                    variant={user.role === 'technician' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    {user.role === 'technician' ? 'Técnico' : 'Cliente'}
                  </Badge>
                  
                  {user.verificationStatus && (
                    <Badge 
                      variant={user.verificationStatus === 'verified' ? 'success' : user.verificationStatus === 'pending' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {user.verificationStatus === 'verified' ? 'Verificado' : user.verificationStatus === 'pending' ? 'Pendiente' : 'No verificado'}
                    </Badge>
                  )}
                </div>
                
                {user.role === 'technician' && user.rating && (
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-warning-500 mr-1" />
                    <span className="font-medium">{user.rating.toFixed(1)}</span>
                    <span className="text-neutral-500 text-sm ml-1">({user.completedServices} servicios)</span>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleProfileEdit}
                  className="mt-3"
                >
                  {editMode ? (
                    <>Guardar Cambios</>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar Perfil
                    </>
                  )}
                </Button>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-500 uppercase">Información de Contacto</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-neutral-500 mr-3 mt-0.5" />
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={editedProfile.email}
                        onChange={handleInputChange}
                        className="flex-1 border-b border-neutral-300 pb-1 focus:outline-none focus:border-primary-500"
                      />
                    ) : (
                      <span>{user.email}</span>
                    )}
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-neutral-500 mr-3 mt-0.5" />
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedProfile.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Agregar número de teléfono"
                        className="flex-1 border-b border-neutral-300 pb-1 focus:outline-none focus:border-primary-500"
                      />
                    ) : (
                      <span>{user.phone || 'No especificado'}</span>
                    )}
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-neutral-500 mr-3 mt-0.5" />
                    {editMode ? (
                      <input
                        type="text"
                        name="address"
                        value={editedProfile.address || ''}
                        onChange={handleInputChange}
                        placeholder="Agregar dirección"
                        className="flex-1 border-b border-neutral-300 pb-1 focus:outline-none focus:border-primary-500"
                      />
                    ) : (
                      <span>{user.address || 'No especificado'}</span>
                    )}
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-neutral-500 mr-3 mt-0.5" />
                    <span>Miembro desde {formatDate(user.joinDate)}</span>
                  </div>
                </div>
              </div>
              
              {/* Bio / About */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-500 uppercase">Acerca de mí</h2>
                
                {editMode ? (
                  <textarea
                    name="bio"
                    value={editedProfile.bio || ''}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos sobre ti..."
                    className="w-full border border-neutral-300 rounded-md p-2 focus:outline-none focus:border-primary-500 min-h-[100px]"
                  />
                ) : (
                  <p className="text-neutral-700">
                    {user.bio || 'No hay información disponible.'}
                  </p>
                )}
              </div>
              
              {/* Specialties (for technicians) */}
              {user.role === 'technician' && user.specialties && (
                <div className="space-y-3">
                  <h2 className="text-sm font-medium text-neutral-500 uppercase">Especialidades</h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {user.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Notifications */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-500 uppercase">Notificaciones</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Notificaciones por correo</span>
                    </div>
                    <Switch 
                      checked={settings.notifications.email} 
                      onCheckedChange={(checked) => handleSettingsChange('notifications', 'email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Notificaciones push</span>
                    </div>
                    <Switch 
                      checked={settings.notifications.push} 
                      onCheckedChange={(checked) => handleSettingsChange('notifications', 'push', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Notificaciones SMS</span>
                    </div>
                    <Switch 
                      checked={settings.notifications.sms} 
                      onCheckedChange={(checked) => handleSettingsChange('notifications', 'sms', checked)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Privacy */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-500 uppercase">Privacidad</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Mostrar perfil público</span>
                    </div>
                    <Switch 
                      checked={settings.privacy.showProfile} 
                      onCheckedChange={(checked) => handleSettingsChange('privacy', 'showProfile', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Mostrar calificaciones</span>
                    </div>
                    <Switch 
                      checked={settings.privacy.showRating} 
                      onCheckedChange={(checked) => handleSettingsChange('privacy', 'showRating', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Mostrar información de contacto</span>
                    </div>
                    <Switch 
                      checked={settings.privacy.showContact} 
                      onCheckedChange={(checked) => handleSettingsChange('privacy', 'showContact', checked)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Appearance */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-500 uppercase">Apariencia</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {settings.appearance.theme === 'light' ? (
                        <Sun className="h-5 w-5 text-neutral-500 mr-3" />
                      ) : settings.appearance.theme === 'dark' ? (
                        <Moon className="h-5 w-5 text-neutral-500 mr-3" />
                      ) : (
                        <div className="h-5 w-5 relative mr-3">
                          <Sun className="h-5 w-5 text-neutral-500 absolute" />
                          <Moon className="h-5 w-5 text-neutral-500 absolute opacity-40" />
                        </div>
                      )}
                      <span>Tema</span>
                    </div>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => handleSettingsChange('appearance', 'theme', e.target.value)}
                      className="border border-neutral-300 rounded-md p-1 text-sm"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Tamaño de fuente</span>
                    </div>
                    <select
                      value={settings.appearance.fontSize}
                      onChange={(e) => handleSettingsChange('appearance', 'fontSize', e.target.value)}
                      className="border border-neutral-300 rounded-md p-1 text-sm"
                    >
                      <option value="small">Pequeño</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Security */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-500 uppercase">Seguridad</h2>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => {
                      // Handle change password
                    }}
                  >
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Cambiar contraseña</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-400" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => {
                      // Handle two-factor authentication
                    }}
                  >
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-neutral-500 mr-3" />
                      <span>Autenticación de dos factores</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-400" />
                  </Button>
                </div>
              </div>
              
              {/* Account */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-500 uppercase">Cuenta</h2>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between text-danger-500 hover:text-danger-600 hover:border-danger-300"
                    onClick={() => {
                      // Handle delete account
                    }}
                  >
                    <span>Eliminar cuenta</span>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Drawer>
  );
};

// Profile button component
interface ProfileButtonProps {
  onClick: () => void;
  user: {
    name: string;
    avatar?: string;
  };
  variant?: 'ghost' | 'outline' | 'subtle' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
  onClick,
  user,
  variant = 'ghost',
  size = 'md',
  className = '',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`flex items-center space-x-2 ${className}`}
      aria-label="Perfil de usuario"
    >
      <Avatar 
        src={user.avatar} 
        alt={user.name}
        size={size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'md'}
      />
      <span className="hidden md:inline">{user.name}</span>
    </Button>
  );
};

// Example usage component
export const UserProfileExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    name: 'Carlos Méndez',
    email: 'carlos@example.com',
    phone: '+1 809-555-1234',
    address: 'Calle Principal #123, Santo Domingo',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'technician',
    joinDate: new Date(2022, 3, 15),
    rating: 4.8,
    completedServices: 127,
    bio: 'Técnico especializado con más de 10 años de experiencia en reparaciones eléctricas y de plomería. Comprometido con ofrecer un servicio de calidad y puntual.',
    specialties: ['Electricidad', 'Plomería', 'Climatización', 'Carpintería'],
    verificationStatus: 'verified',
  });
  
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      showProfile: true,
      showRating: true,
      showContact: false,
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
    },
  });

  // Handle profile update
  const handleUpdateProfile = (profile: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...profile,
    }));
  };

  // Handle settings update
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Handle logout
  const handleLogout = () => {
    // Handle logout logic
    setIsOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ejemplo de Perfil de Usuario</h1>
      
      <ProfileButton 
        onClick={() => setIsOpen(true)} 
        user={{
          name: user.name,
          avatar: user.avatar,
        }}
        variant="outline"
      />
      
      <UserProfileDrawer 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        settings={settings}
        onUpdateProfile={handleUpdateProfile}
        onUpdateSettings={handleUpdateSettings}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default UserProfileDrawer;