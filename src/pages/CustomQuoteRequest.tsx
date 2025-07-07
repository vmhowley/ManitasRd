import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quoteRequestService, type QuoteRequestData } from '../services/quoteRequestService';
import { ArrowLeft, Send } from 'lucide-react';

const serviceCategories = [
  'Plomería',
  'Electricidad',
  'Reparaciones',
  'Pintura',
  'Belleza',
  'Automotriz',
  'Limpieza',
  'Tecnología',
];

export const CustomQuoteRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para solicitar un presupuesto.');
      return;
    }

    if (!description || !category || !location) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const requestData: QuoteRequestData = {
      description,
      category,
      location,
    };

    try {
      await quoteRequestService.createQuoteRequest(requestData);
      setSuccess('Tu solicitud de presupuesto ha sido enviada con éxito!');
      setDescription('');
      setCategory('');
      setLocation('');
    } catch (err) {
      console.error('Error creating quote request:', err);
      setError('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Send className="h-7 w-7 mr-3 text-blue-600" />
          Solicitar Presupuesto Personalizado
        </h1>
        <p className="text-gray-600 mb-8">
          Describe detalladamente el servicio que necesitas y los técnicos te enviarán un presupuesto.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Servicio
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Necesito instalar un calentador de agua nuevo y reparar una fuga en el grifo de la cocina."
            ></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría del Servicio
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una categoría</option>
              {serviceCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación del Servicio
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Santo Domingo, Ensanche Naco"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Solicitud de Presupuesto'}
          </button>
        </form>
      </div>
    </div>
  );
};
