import  { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/layout/Header';
import { InputField } from '../components/InputField';

type FormValues = {
  password: string;
  confirmPassword: string;
};

export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<FormValues>();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!token) {
      showToast('Token no válido o faltante.', 'error');
      return;
    }
    try {
      const response = await authService.resetPassword(token, data.password);
      showToast(response.msg, 'success');
      navigate('/login');
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || 'No se pudo restablecer la contraseña.';
      showToast(errorMsg, 'error');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Restablecer Contraseña</h2>
            <p className="mt-2 text-gray-600">Crea una nueva contraseña para tu cuenta.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <InputField
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="Nueva Contraseña"
                error={errors.password?.message}
                {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-900">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <InputField
              icon={Lock}
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { required: 'Confirma tu nueva contraseña', validate: value => value === getValues('password') || 'Las contraseñas no coinciden' })}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Actualizando...' : 'Restablecer Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
