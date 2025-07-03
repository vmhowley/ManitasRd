import {
  User,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

export const ClientDashboard = () => {
  const { user, logout, serviceRequests } = useAuth();
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'asignado':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'in-process':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'assigned':
        return 'Asignado';
      case 'in-process':
        return 'En Proceso';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const activeRequests = serviceRequests.filter(
    (req) => req.clientId === user._id && ['pending', 'assigned', 'in-process'].includes(req.status)
  );

  const completedRequests = serviceRequests.filter(
    (req) => req.clientId === user._id && ['completed', 'cancelled'].includes(req.status)
  );

  const handleLogout = () => {
    logout();
    return <Navigate to="/" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Panel Cliente</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/messaging')}>
                <MessageCircle className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Bienvenido, {user.name}!</h1>
              <p className="text-blue-100">
                Gestiona tus servicios y encuentra técnicos profesionales
              </p>
            </div>
            <button
              onClick={() => navigate('/service-request')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Solicitar Servicio
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Services */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Servicios Activos</h2>
              {activeRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No tienes servicios activos</p>
                  <button
                    onClick={() => navigate('/service-request')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Solicitar tu primer servicio
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    console.log(request),
                    <div
                      key={request._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getStatusIcon(request.status)}
                            <span className="ml-2 font-medium text-gray-900">{request.category}</span>
                            <span className="ml-2 text-sm text-gray-500">#{request._id}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {request.address}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(request.preferredDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'assigned'
                                ? 'bg-blue-100 text-blue-800'
                                : request.status === 'in-process'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {getStatusText(request.status)}
                          </span>
                          {request.status !== 'pending' && (
                            <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                              Ver detalles
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service History */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Historial de Servicios</h2>
              {completedRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes servicios completados aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedRequests.slice(0, 5).map((request) => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getStatusIcon(request.status)}
                            <span className="ml-2 font-medium text-gray-900">{request.category}</span>
                            <span className="ml-2 text-sm text-gray-500">#{request._id}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {getStatusText(request.status)}
                          </span>
                          {request.status === 'completed' && (
                            <div className="flex items-center mt-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">Calificar</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Servicios Activos</span>
                  <span className="font-semibold text-blue-600">{activeRequests.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Servicios Completados</span>
                  <span className="font-semibold text-green-600">
                    {completedRequests.filter((r) => r.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total de Servicios</span>
                  <span className="font-semibold text-gray-900">
                    {serviceRequests.filter((r) => r.clientId === user._id).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};
