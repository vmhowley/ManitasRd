import React from 'react';
import { UserCheck, LogOut, Star, Clock, CheckCircle, AlertCircle, MessageCircle, Calendar, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { User as UserType, ServiceRequest } from '../App';

interface TechnicianDashboardProps {
  user: UserType | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  serviceRequests: ServiceRequest[];
}

export default function TechnicianDashboard({ user, onNavigate, onLogout, serviceRequests }: TechnicianDashboardProps) {
  if (!user) return null;

  const getStatusIcon = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'assigned':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'Nueva';
      case 'assigned':
        return 'Asignada';
      case 'in-progress':
        return 'En Proceso';
      case 'completed':
        return 'Finalizada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  // Filter requests that match technician's specialties
  const relevantRequests = serviceRequests.filter(req => 
    user.specialties?.some(specialty => 
      req.category.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(req.category.toLowerCase())
    )
  );

  const assignedRequests = relevantRequests.filter(req => 
    req.technicianId === user.id && ['assigned', 'in-progress'].includes(req.status)
  );

  const completedRequests = relevantRequests.filter(req => 
    req.technicianId === user.id && req.status === 'completed'
  );

  const newRequests = relevantRequests.filter(req => 
    req.status === 'pending'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Panel Técnico</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">{user.rating}</span>
              </div>
              <button 
                onClick={() => onNavigate('messaging')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
              </button>
              <button
                onClick={onLogout}
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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Hola, {user.name}!</h1>
              <p className="text-green-100 mb-2">
                Especialidades: {user.specialties?.join(', ')}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span>Rating: {user.rating}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>{completedRequests.length} trabajos completados</span>
                </div>
              </div>
            </div>
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Solicitudes Nuevas</p>
                <p className="text-2xl font-bold text-gray-900">{newRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">{assignedRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{completedRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-gray-900">${(completedRequests.length * 150).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* New Requests */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Nuevas Solicitudes</h2>
              
              {newRequests.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay nuevas solicitudes disponibles</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {newRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getStatusIcon(request.status)}
                            <span className="ml-2 font-medium text-gray-900">{request.category}</span>
                            <span className="ml-2 text-sm text-gray-500">#{request.id}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {request.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(request.preferredDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Aceptar
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assigned Requests */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Trabajos Asignados</h2>
              
              {assignedRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes trabajos asignados actualmente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getStatusIcon(request.status)}
                            <span className="ml-2 font-medium text-gray-900">{request.category}</span>
                            <span className="ml-2 text-sm text-gray-500">#{request.id}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{request.description}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {request.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(request.preferredDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {getStatusText(request.status)}
                          </span>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            {request.status === 'assigned' ? 'Iniciar' : 'Completar'}
                          </button>
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
            {/* Performance */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating Promedio</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold text-gray-900">{user.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trabajos Completados</span>
                  <span className="font-semibold text-green-600">{completedRequests.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tasa de Aceptación</span>
                  <span className="font-semibold text-blue-600">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ingresos del Mes</span>
                  <span className="font-semibold text-purple-600">${(completedRequests.length * 150).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Ver Estadísticas
                </button>
                <button
                  onClick={() => onNavigate('messaging')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Mensajes
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Editar Perfil
                </button>
              </div>
            </div>

            {/* Earnings */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingresos</h3>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                ${(completedRequests.length * 150).toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Este mes
              </p>
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}