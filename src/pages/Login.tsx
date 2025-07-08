import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/layout/Header';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      navigate(user.type === 'technician' ? '/technician-dashboard' : '/client-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Por favor, completa todos los campos.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Inicio de sesión exitoso!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/8469037/pexels-photo-8469037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative w-full max-w-md mx-auto bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <div className="text-center text-white mb-8">
            <h2 className="text-4xl font-bold">Bienvenido de Nuevo</h2>
            <p className="mt-2 text-lg text-gray-300">Accede a tu cuenta para continuar</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 text-white placeholder-gray-400 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-gray-900/50 text-white placeholder-gray-400 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-end">
              <Link to="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-bold text-white hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-black/30 rounded-lg text-gray-300 border border-gray-700">
            <p className="text-sm font-medium mb-2 text-white">Credenciales de prueba:</p>
            <div className="text-xs space-y-1">
              <p><strong>Cliente:</strong> client@example.com / password</p>
              <p><strong>Técnico:</strong> tech@example.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
