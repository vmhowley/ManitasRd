import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { standardService } from '../services/standardService';
import type { Service } from '../types/Service';
import { userService } from '../services/userService';
import type { TechnicianUpdatePayload } from '../types/User';
import { ArrowLeft, Save, Loader2, User, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Reusable Input Field
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({ icon: Icon, label, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        {...props}
        className="block w-full rounded-lg border-gray-300 pl-10 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
    </div>
  </div>
);

export const EditTechnicianProfile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    specialties: user?.specialties || [],
    hourlyRate: user?.hourlyRate?.toString() || '',
    servicesOffered: user?.servicesOffered || [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.type !== 'technician') {
        navigate('/login');
        return;
      }
      try {
        const servicesResponse = await standardService.getAllServices();
        setAllServices(servicesResponse.data);
        const initialServicesOffered = servicesResponse.data.map((service: Service) => {
          const existingOffer = user.servicesOffered?.find(so => so.service._id === service._id);
          return {
            service: service,
            price: existingOffer ? existingOffer.price : service.basePrice,
          };
        });
        setFormData(prev => ({ ...prev, servicesOffered: initialServicesOffered }));
      } catch  {
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleServicePriceChange = (serviceId: string, price: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.map(so =>
        so.service._id === serviceId ? { ...so, price: parseFloat(price) || 0 } : so
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    setError(null);
    try {
      const updatedData = {
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate),
        servicesOffered: formData.servicesOffered.map(so => ({
          service: so.service._id,
          price: so.price,
        })),
      };
      await userService.updateUser(user._id, updatedData as TechnicianUpdatePayload);
      await refreshUser();
      showToast('Perfil actualizado con éxito!', 'success');
      navigate('/technician-dashboard');
    } catch (err: unknown) {
      let errorMessage = "Error al guardar el perfil.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-3 text-lg text-gray-700">Cargando perfil...</span>
      </div>
    );
  }

  const specialtyOptions = [
    'Electricidad', 'Plomería', 'Refrigeración', 'Reparaciones', 'Pintura',
    'Limpieza', 'Jardinería', 'Carpintería', 'Automotriz',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8 mb-24">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
              <p className="mt-1 text-sm text-gray-600">Actualiza tu información profesional para atraer más clientes.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/technician-dashboard')}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </button>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField icon={User} label="Nombre Completo" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              <InputField icon={Mail} label="Correo Electrónico" id="email" name="email" value={formData.email} disabled />
              <InputField icon={Phone} label="Teléfono" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              <InputField icon={MapPin} label="Dirección" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              <InputField icon={DollarSign} label="Tarifa por Hora (DOP)" id="hourlyRate" name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange} step="0.01" />
            </div>
          </div>

          {/* Specialties Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Especialidades</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specialtyOptions.map((specialty) => (
                <label key={specialty} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(specialty)}
                    onChange={() => handleSpecialtyChange(specialty)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-800">{specialty}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Prices Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Precios por Servicio</h2>
            <p className="text-sm text-gray-600 mb-6">Personaliza tus tarifas. Si dejas un campo vacío, se usará el precio base.</p>
            <div className="space-y-4">
              {allServices.map((service) => {
                const currentPrice = formData.servicesOffered.find(so => so.service._id === service._id)?.price ?? service.basePrice;
                return (
                  <div key={service._id} className="grid grid-cols-3 items-center gap-4">
                    <div className="col-span-1">
                      <p className="font-medium text-gray-800">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.category}</p>
                    </div>
                    <p className="text-sm text-gray-600 text-center">Base: RD${service.basePrice.toFixed(2)}</p>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">RD$</span>
                      </div>
                      <input
                        type="number"
                        value={currentPrice === 0 ? '' : currentPrice}
                        onChange={(e) => handleServicePriceChange(service._id, e.target.value)}
                        className="block w-full rounded-lg border-gray-300 pl-10 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        step="0.01"
                        placeholder={service.basePrice.toFixed(2)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </main>

      {/* Sticky Footer for Save Button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-end">
          {error && <p className="text-red-600 text-sm mr-4">{error}</p>}
          <button
            type="submit"
            form="edit-profile-form" // Make sure to add id="edit-profile-form" to your form
            disabled={isSaving}
            className="w-full md:w-auto flex justify-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isSaving ? (
              <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Guardando...</>
            ) : (
              <><Save className="h-5 w-5 mr-2" /> Guardar Cambios</>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
