import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { standardService, type Service } from '../services/standardService';
import { userService } from '../services/userService';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const EditTechnicianProfile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
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
        navigate('/login'); // Redirect if not logged in or not a technician
        return;
      }

      try {
        const servicesResponse = await standardService.getAllServices();
        setAllServices(servicesResponse.data);

        // Initialize servicesOffered with existing data or default to base prices
        const initialServicesOffered = servicesResponse.data.map((service: Service) => {
          const existingOffer = user.servicesOffered?.find(so => so.service._id === service._id);
          return {
            service: service._id,
            price: existingOffer ? existingOffer.price : service.basePrice,
          };
        });
        setFormData(prev => ({
          ...prev,
          servicesOffered: initialServicesOffered,
        }));

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
        so.service === serviceId ? { ...so, price: parseFloat(price) || 0 } : so
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        specialties: formData.specialties,
        hourlyRate: parseFloat(formData.hourlyRate),
        servicesOffered: formData.servicesOffered,
      };

      await userService.updateUser(user._id, updatedData);
      await refreshUser(); // Refresh user data in AuthContext
      showToast('Perfil actualizado con éxito!', 'success');
      navigate('/technician-dashboard');
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Error al guardar el perfil. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin mr-2" /> Cargando perfil...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const specialtyOptions = [
    'Electricidad',
    'Plomería',
    'Refrigeración',
    'Reparaciones',
    'Pintura',
    'Limpieza',
    'Jardinería',
    'Carpintería',
    'Automotriz',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/technician-dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Editar Perfil de Técnico</h2>
          <div></div> {/* Spacer */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
              <input type="email" id="email" name="email" value={formData.email} disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">Tarifa por Hora (DOP)</label>
              <input type="number" id="hourlyRate" name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {specialtyOptions.map((specialty) => (
                <label key={specialty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(specialty)}
                    onChange={() => handleSpecialtyChange(specialty)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Service Prices */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Precios Personalizados por Servicio</h3>
            <p className="text-sm text-gray-600 mb-4">Define tu precio para cada servicio. Si dejas el campo vacío, se usará el precio base del servicio.</p>
            <div className="space-y-4">
              {allServices.map((service) => {
                const currentPrice = formData.servicesOffered.find(so => so.service === service._id)?.price || service.basePrice;
                return (
                  <div key={service._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-800">{service.name} ({service.category})</p>
                      <p className="text-sm text-gray-500">Precio base: RD${service.basePrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2">RD$</span>
                      <input
                        type="number"
                        value={currentPrice === 0 ? '' : currentPrice.toFixed(2)} // Display empty if 0, otherwise fixed to 2 decimals
                        onChange={(e) => handleServicePriceChange(service._id, e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
                        step="0.01"
                        placeholder={service.basePrice.toFixed(2)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <><Loader2 className="animate-spin mr-2" /> Guardando...</>
            ) : (
              <><Save className="h-5 w-5 mr-2" /> Guardar Cambios</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
