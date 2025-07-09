import { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone, MapPin, Briefcase, DollarSign, ArrowRight, ArrowLeft, UserCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/layout/Header';
import { InputField } from '../components/InputField';

const specialtyOptions = [
  'Electricidad', 'Plomería', 'Refrigeración', 'Reparaciones', 'Pintura',
  'Limpieza', 'Jardinería', 'Carpintería', 'Automotriz'
];

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'client' | 'technician' | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', address: '',
    specialties: [] as string[], experience: '', hourlyRate: '', avatar: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const nextStep = () => {
    // Basic validation before proceeding
    if (step === 2) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        showToast('Por favor, completa todos los campos.', 'warning');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('Las contraseñas no coinciden.', 'error');
        return;
      }
    }
    if (step === 3 && userType === 'client') {
       if (!formData.phone || !formData.address) {
        showToast('Por favor, completa tu información de contacto.', 'warning');
        return;
      }
    }
    setStep(s => s + 1);
  }

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'technician' && formData.specialties.length === 0) {
      showToast('Selecciona al menos una especialidad.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'specialties') {
          dataToSend.append(key, JSON.stringify(value));
        } else if (value !== null) {
          dataToSend.append(key, value as string | Blob);
        }
      });
      dataToSend.append('type', userType!);

      await authService.register(dataToSend);
      await login(formData.email, formData.password);
      showToast('¡Registro exitoso!', 'success');
      navigate(userType === 'client' ? '/client-dashboard' : '/technician-dashboard');
    } catch (error) {
      showToast('Hubo un error durante el registro.', 'error');
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
              <button onClick={() => { setUserType('client'); nextStep(); }} className="p-8 bg-white rounded-2xl text-center border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all transform hover:scale-105">
                <UserPlus className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-bold text-xl text-gray-900">Soy Cliente</h3>
                <p className="text-sm text-gray-600">Necesito un servicio</p>
              </button>
              <button onClick={() => { setUserType('technician'); nextStep(); }} className="p-8 bg-white rounded-2xl text-center border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all transform hover:scale-105">
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
              <InputField icon={User} name="name" type="text" placeholder="Nombre Completo" value={formData.name} onChange={handleInputChange} required />
              <InputField icon={Mail} name="email" type="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleInputChange} required />
              <div className="relative">
                <InputField icon={Lock} name="password" type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={formData.password} onChange={handleInputChange} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-900">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <InputField icon={Lock} name="confirmPassword" type="password" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleInputChange} required />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900">Información de Contacto</h2>
            <p className="mt-2 text-gray-600">Ayúdanos a saber dónde encontrarte.</p>
            <div className="space-y-4 mt-6 text-left">
              <InputField icon={Phone} name="phone" type="tel" placeholder="Teléfono" value={formData.phone} onChange={handleInputChange} required />
              <InputField icon={MapPin} name="address" type="text" placeholder="Dirección" value={formData.address} onChange={handleInputChange} required />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-3xl font-bold text-gray-900">Perfil Profesional</h2>
            <p className="mt-2 text-gray-600">Completa tu perfil para atraer clientes.</p>
            <div className="space-y-4 mt-6 text-left">
              <InputField icon={Briefcase} name="experience" type="text" placeholder="Años de experiencia" value={formData.experience} onChange={handleInputChange} />
              <InputField icon={DollarSign} name="hourlyRate" type="number" placeholder="Tarifa por hora (DOP)" value={formData.hourlyRate} onChange={handleInputChange} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {specialtyOptions.map(s => (
                    <label key={s} className="flex items-center bg-gray-50 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 cursor-pointer">
                      <input type="checkbox" checked={formData.specialties.includes(s)} onChange={() => handleSpecialtyChange(s)} className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="ml-2 text-sm font-medium text-gray-800">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          {step > 1 && <ProgressBar currentStep={step} totalSteps={totalSteps} />}
          <form onSubmit={handleSubmit}>
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
