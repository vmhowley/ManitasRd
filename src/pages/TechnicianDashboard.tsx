import { 
  UserCheck, LogOut, Star, Clock, CheckCircle, AlertCircle, 
  MessageCircle, Calendar, MapPin, DollarSign 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export const TechnicianDashboard = () => {
  const { user, logout, serviceRequests, loading } = useAuth();
  console.log("🚀 ~ TechnicianDashboard ~ user:", user)
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Nueva';
      case 'assigned': return 'Asignada';
      case 'in-progress': return 'En Proceso';
      case 'completed': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  // Filtrar solicitudes relevantes según las especialidades del técnico
  const relevantRequests = serviceRequests.filter(req =>
    user.specialties?.some(specialty =>
      req.category.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(req.category.toLowerCase())
    )
  );

  const assignedRequests = relevantRequests.filter(req =>
    req.technicianId === user._id && ['assigned', 'in-progress'].includes(req.status)
  );

  const completedRequests = relevantRequests.filter(req =>
    req.technicianId === user._id && req.status === 'completed'
  );

  const newRequests = relevantRequests.filter(req => req.status === 'pending');

  const handleLogout = () => {
    logout();
  };

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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Panel Técnico</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">{user.rating}</span>
              </div>
              <button
                onClick={() => navigate('/messaging')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Mensajes"
              >
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
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
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Solicitudes Nuevas</p>
              <p className="text-2xl font-bold text-gray-900">{newRequests.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-gray-900">{assignedRequests.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-gray-900">{completedRequests.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(completedRequests.length * 150).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getStatusIcon(request.status)}
                            <span className="ml-2 font-medium text-gray-900">
                              {getStatusText(request.status)}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">{request.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {request.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {request.price ? `$${request.price}` : 'Sin precio'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/requests/${request.id}`)}
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

            {/* Assigned Requests */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
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
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{request.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/requests/${request.id}`)}
                          className="text-blue-600 hover:underline text-sm"
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
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <img
                src={user.avatar || '/default-avatar.png'}
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
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de trabajos</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                {completedRequests.length > 0 ? (
                  completedRequests.slice(0, 5).map((request) => (
                    <li key={request._id} className="border-b border-gray-200 pb-2">
                      <p className="font-medium">{request.categoria}</p>
                      <p className="text-gray-500">{new Date(request.completedAt).toLocaleDateString()}</p>
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
    </div>
  );
};
