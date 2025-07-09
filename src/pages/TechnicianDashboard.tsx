import { useEffect, useState } from 'react';
import {
  Star, Clock, CheckCircle, AlertCircle,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { serviceRequestService } from '../services/serviceRequestService';
import type { ServiceRequest } from '../types/ServiceRequest';
import { getAvatarUrl } from '../utils/avatarUtils';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const TechnicianDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        try {
          const requests = await serviceRequestService.getRequests();
          setServiceRequests(requests);
        } catch (error) {
          console.error("Error fetching requests:", error);
          showToast("Error al cargar las solicitudes.", "error");
        }
      }
    };
    fetchRequests();
  }, [user, showToast]);

  

  // Filtrar solicitudes relevantes según las especialidades del técnico
  const relevantRequests = user ? serviceRequests.filter(req =>
    user.specialties?.some(specialty =>
      req.category.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(req.category.toLowerCase())
    )
  ) : [];

  const assignedRequests = user ? relevantRequests.filter(req =>
    req.technicianId === user._id && ['assigned', 'in-process'].includes(req.status)
  ) : [];

  const completedRequests = user ? relevantRequests.filter(req =>
    req.technicianId === user._id && req.status === 'completed'
  ) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando datos...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">¡Hola, {user.name}!</h1>
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                Especialidades: {user.specialties?.join(', ')}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span>Rating: {user.rating}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>{completedRequests.length} trabajos completados</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/edit-technician-profile')}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm"
            >
              Editar Perfil
            </button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">Nuevas</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">En Proceso</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{assignedRequests.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">Completados</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{completedRequests.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">Ingresos</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                ${(completedRequests.length * 150).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            

            {/* Assigned Requests */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Solicitudes Asignadas</h2>

              {assignedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes solicitudes asignadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedRequests.map((request) => (
                    <div
                      key={request._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{request.category}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/requests/${request._id}`)}
                          className="ml-4 text-blue-600 hover:underline text-sm"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile */}
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <img
                src={getAvatarUrl(user.name)}
                alt={`${user.name} avatar`}
                className="mx-auto h-24 w-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="mt-2 text-gray-600">
                Especialidades: {user.specialties?.join(', ') || 'No especificadas'}
              </p>
            </div>

            {/* Completed Requests Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de trabajos</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                {completedRequests.length > 0 ? (
                  completedRequests.slice(0, 5).map((request) => (
                    <li key={request._id} className="border-b border-gray-200 pb-2">
                      <p className="font-medium">{request.category}</p>
                      <p className="text-gray-500">{new Date(request.requestDate).toLocaleDateString()}</p>
                    </li>
                  ))
                ) : (
                  <p>No has completado trabajos aún.</p>
                )}
              </ul>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
};
