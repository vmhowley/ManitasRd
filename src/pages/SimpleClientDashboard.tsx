import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const SimpleClientDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  console.log('=== SIMPLE CLIENT DASHBOARD ===');
  console.log('User:', user ? { uid: user.uid, email: user.email, type: user.type } : 'No user');
  console.log('Auth Loading:', authLoading);

  if (authLoading) {
    return <div className="p-8">Cargando autenticación...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Datos hardcodeados para prueba
  const mockServiceRequests = [
    {
      _id: 'test1',
      clientId: user.uid,
      status: 'pending',
      category: 'Plomería',
      description: 'Reparación de tubería',
      createdAt: new Date()
    },
    {
      _id: 'test2',
      clientId: user.uid,
      status: 'pending',
      category: 'Electricidad',
      description: 'Instalación de tomacorriente',
      createdAt: new Date()
    }
  ];

  const activeServiceRequests = mockServiceRequests.filter((req) => {
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    const userMatches = user && user.uid && clientId === user.uid;
    const statusMatches = ['pending', 'assigned', 'in-process'].includes(req.status);
    const matches = userMatches && statusMatches;
    
    console.log(`Mock Request ${req._id}: clientId=${clientId}, userUID=${user?.uid}, status=${req.status}, match=${matches}`);
    
    return matches;
  });

  console.log('Active Service Requests:', activeServiceRequests.length);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard del Cliente (Simple)</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Información del Usuario:</h2>
        <p>UID: {user.uid}</p>
        <p>Email: {user.email}</p>
        <p>Tipo: {user.type}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Servicios Estándar Activos</h2>
        {activeServiceRequests.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-4">
              No tienes servicios estándar activos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeServiceRequests.map((request) => (
              <div
                key={request._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{request.category}</h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {request.status === 'pending' ? 'Pendiente' : request.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{request.description}</p>
                <p className="text-sm text-gray-500">
                  Creado: {request.createdAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>Total Mock Requests: {mockServiceRequests.length}</p>
          <p>Active Mock Requests: {activeServiceRequests.length}</p>
          <p>User UID: {user.uid}</p>
        </div>
      </div>
    </div>
  );
};