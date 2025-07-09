import { useForm, type SubmitHandler } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/layout/Header';
import { InputField } from '../components/InputField';

type FormValues = {
  email: string;
};

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const { showToast } = useToast();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await authService.forgotPassword(data.email);
      showToast(response.msg, 'success');
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || 'Error al enviar el correo de recuperación.';
      showToast(errorMsg, 'error');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">¿Olvidaste tu Contraseña?</h2>
            <p className="mt-2 text-gray-600">No te preocupes. Ingresa tu correo y te enviaremos un enlace para recuperarla.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              icon={Mail}
              type="email"
              placeholder="Correo Electrónico"
              error={errors.email?.message}
              {...register('email', { required: 'El correo es obligatorio', pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' } })}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
