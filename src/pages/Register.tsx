import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Eye, EyeOff, User, Lock, Mail, Phone, MapPin, Briefcase, DollarSign, ArrowRight, ArrowLeft, UserCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { InputField } from '../components/InputField';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  specialties: string[];
  experience: string;
  hourlyRate: string;
  avatar: FileList;
};

const specialtyOptions = [
  'Electricidad', 'Plomería', 'Refrigeración', 'Reparaciones', 'Pintura',
  'Limpieza', 'Jardinería', 'Carpintería', 'Automotriz'
];

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
      <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
    </div>
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'client' | 'technician' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, trigger, getValues, watch } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      specialties: [],
    }
  });

  const specialties = watch('specialties');

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 2) fieldsToValidate = ['name', 'email', 'password', 'confirmPassword'];
    if (step === 3) fieldsToValidate = ['phone', 'address'];
    if (step === 4 && userType === 'technician') fieldsToValidate = ['experience', 'hourlyRate', 'specialties'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (userType === 'technician' && data.specialties.length === 0) {
      showToast('Selecciona al menos una especialidad.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const dataToSend = {
        email: data.email,
        password: data.password,
        name: data.name,
        type: userType!,
        phone: data.phone,
        address: data.address,
        specialties: data.specialties,
        hourlyRate: data.hourlyRate
      };

      await authService.register(dataToSend);
      await login(data.email, data.password);
      showToast('¡Registro exitoso!', 'success');
      navigate(userType === 'client' ? '/client-dashboard' : '/technician-home');
    } catch (error: unknown) {
      let errorMsg = 'Hubo un error durante el registro.';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { errors?: { msg?: string }[] } } };
        errorMsg = err.response?.data?.errors?.[0]?.msg || errorMsg;
      }
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = userType === 'technician' ? 4 : 3;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900">Únete a Nosotros</h2>
            <p className="mt-2 text-gray-600">¿Cómo quieres empezar?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <button onClick={() => { setUserType('client'); setStep(2); }} className="p-8 bg-white rounded-2xl text-center border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all transform hover:scale-105">
                <UserPlus className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-xl text-gray-900">Soy Cliente</h3>
                <p className="text-sm text-gray-600">Necesito un servicio</p>
              </button>
              <button onClick={() => { setUserType('technician'); setStep(2); }} className="p-8 bg-white rounded-2xl text-center border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all transform hover:scale-105">
                <UserCheck className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-xl text-gray-900">Soy Técnico</h3>
                <p className="text-sm text-gray-600">Quiero ofrecer mis servicios</p>
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900">Crea tu Cuenta</h2>
            <p className="mt-2 text-gray-600">Empecemos con lo básico.</p>
            <div className="space-y-4 mt-6 text-left">
              <InputField icon={User} placeholder="Nombre Completo" error={errors.name?.message} {...register('name', { required: 'El nombre es obligatorio' })} />
              <InputField icon={Mail} type="email" placeholder="Correo Electrónico" error={errors.email?.message} {...register('email', { required: 'El correo es obligatorio', pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' } })} />
              <div className="relative">
                <InputField icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Contraseña" error={errors.password?.message} {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-900">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <InputField icon={Lock} type="password" placeholder="Confirmar Contraseña" error={errors.confirmPassword?.message} {...register('confirmPassword', { required: 'Confirma tu contraseña', validate: value => value === getValues('password') || 'Las contraseñas no coinciden' })} />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900">Información de Contacto</h2>
            <p className="mt-2 text-gray-600">Ayúdanos a saber dónde encontrarte.</p>
            <div className="space-y-4 mt-6 text-left">
              <InputField icon={Phone} type="tel" placeholder="Teléfono" error={errors.phone?.message} {...register('phone', { required: 'El teléfono es obligatorio' })} />
              <InputField icon={MapPin} type="text" placeholder="Dirección" error={errors.address?.message} {...register('address', { required: 'La dirección es obligatoria' })} />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900">Perfil Profesional</h2>
            <p className="mt-2 text-gray-600">Completa tu perfil para atraer clientes.</p>
            <div className="space-y-4 mt-6 text-left">
              <InputField icon={Briefcase} type="text" placeholder="Años de experiencia" error={errors.experience?.message} {...register('experience', { required: 'La experiencia es obligatoria' })} />
              <InputField icon={DollarSign} type="number" placeholder="Tarifa por hora (DOP)" error={errors.hourlyRate?.message} {...register('hourlyRate', { required: 'La tarifa es obligatoria', valueAsNumber: true })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specialtyOptions.map(s => (
                    <label key={s} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer ${specialties.includes(s) ? 'border-blue-500 bg-blue-50' : 'bg-gray-50 border-gray-200 hover:border-blue-500'}`}>
                      <input type="checkbox" value={s} className="hidden" {...register('specialties', { required: 'Selecciona al menos una especialidad' })} />
                      <span className="ml-2 text-sm font-medium text-gray-800">{s}</span>
                    </label>
                  ))}
                </div>
                {errors.specialties && <p className="text-red-500 text-xs mt-1">{errors.specialties.message}</p>}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          {step > 1 && <ProgressBar currentStep={step} totalSteps={totalSteps} />}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center mb-8">
              {renderStep()}
            </div>
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 transition-all">
                  <ArrowLeft className="h-5 w-5" /> Anterior
                </button>
              ) : <div />}
              
              {step < totalSteps ? (
                <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all">
                  Siguiente <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 disabled:opacity-70 transition-all">
                  {isLoading ? 'Creando cuenta...' : 'Finalizar Registro'}
                </button>
              )}
            </div>
          </form>
          {step > 1 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
