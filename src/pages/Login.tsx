import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { InputField } from '../components/InputField';

type FormValues = {
  email: string;
  password: string;
};

export const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.type === 'technician' ? '/technician-dashboard' : '/client-dashboard');
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await login(data.email, data.password);
      showToast('Inicio de sesión exitoso!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Bienvenido de Nuevo</h2>
            <p className="mt-2 text-gray-600">Accede a tu cuenta para continuar</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              icon={Mail}
              type="email"
              placeholder="Correo Electrónico"
              error={errors.email?.message}
              {...register('email', { required: 'El correo es obligatorio' })}
            />

            <div className="relative">
              <InputField
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                error={errors.password?.message}
                {...register('password', { required: 'La contraseña es obligatoria' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-900"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
            <p className="text-sm font-medium mb-2 text-gray-800">Credenciales de prueba:</p>
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
