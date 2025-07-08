import { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone, MapPin, Briefcase, DollarSign, ArrowRight, ArrowLeft, UserCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/layout/Header';

const specialtyOptions = [
  'Electricidad', 'Plomería', 'Refrigeración', 'Reparaciones', 'Pintura',
  'Limpieza', 'Jardinería', 'Carpintería', 'Automotriz'
];

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      {...props}
      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 text-white placeholder-gray-400 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    />
  </div>
);

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

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    if (userType === 'technician' && formData.specialties.length === 0) {
      showToast('Selecciona al menos una especialidad', 'error');
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

  const renderStep = () => {
    switch (step) {
      case 1: // Choose User Type
        return (
          <>
            <h2 className="text-4xl font-bold">Únete a Nosotros</h2>
            <p className="mt-2 text-lg text-gray-300">¿Cómo quieres empezar?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <button onClick={() => { setUserType('client'); nextStep(); }} className="p-8 bg-gray-900/50 rounded-2xl text-center border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-900/70 transition-all transform hover:scale-105">
                <UserPlus className="h-12 w-12 mx-auto mb-3" />
                <h3 className="font-bold text-xl">Soy Cliente</h3>
                <p className="text-sm text-gray-400">Necesito un servicio</p>
              </button>
              <button onClick={() => { setUserType('technician'); nextStep(); }} className="p-8 bg-gray-900/50 rounded-2xl text-center border-2 border-gray-700 hover:border-blue-500 hover:bg-gray-900/70 transition-all transform hover:scale-105">
                <UserCheck className="h-12 w-12 mx-auto mb-3" />
                <h3 className="font-bold text-xl">Soy Técnico</h3>
                <p className="text-sm text-gray-400">Quiero ofrecer mis servicios</p>
              </button>
            </div>
          </>
        );
      case 2: // Basic Information
        return (
          <>
            <h2 className="text-3xl font-bold">Crea tu Cuenta</h2>
            <p className="mt-2 text-gray-300">Empecemos con lo básico.</p>
            <div className="space-y-4 mt-6">
              <InputField icon={User} name="name" type="text" placeholder="Nombre Completo" value={formData.name} onChange={handleInputChange} required />
              <InputField icon={Mail} name="email" type="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleInputChange} required />
              <div className="relative">
                <InputField icon={Lock} name="password" type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={formData.password} onChange={handleInputChange} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"><Eye className="h-5 w-5" /></button>
              </div>
              <InputField icon={Lock} name="confirmPassword" type="password" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleInputChange} required />
            </div>
          </>
        );
      case 3: // Contact & Technician Details
        return (
          <>
            <h2 className="text-3xl font-bold">Casi listo...</h2>
            <p className="mt-2 text-gray-300">Completa tu perfil.</p>
            <div className="space-y-4 mt-6">
              <InputField icon={Phone} name="phone" type="tel" placeholder="Teléfono" value={formData.phone} onChange={handleInputChange} required />
              <InputField icon={MapPin} name="address" type="text" placeholder="Dirección" value={formData.address} onChange={handleInputChange} required />
              {userType === 'technician' && (
                <>
                  <InputField icon={Briefcase} name="experience" type="text" placeholder="Años de experiencia" value={formData.experience} onChange={handleInputChange} />
                  <InputField icon={DollarSign} name="hourlyRate" type="number" placeholder="Tarifa por hora (DOP)" value={formData.hourlyRate} onChange={handleInputChange} />
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Especialidades</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specialtyOptions.map(s => (
                        <label key={s} className="flex items-center bg-gray-900/50 p-2 rounded-lg border border-gray-700">
                          <input type="checkbox" checked={formData.specialties.includes(s)} onChange={() => handleSpecialtyChange(s)} className="h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500" />
                          <span className="ml-2 text-sm text-gray-300">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative" style={{ backgroundImage: "url('https://images.pexels.com/photos/8469037/pexels-photo-8469037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative w-full max-w-lg mx-auto bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-8">
              {renderStep()}
            </div>
            
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="flex items-center gap-2 px-5 py-2 bg-gray-700/50 font-bold rounded-full hover:bg-gray-700/80 transition-all">
                  <ArrowLeft className="h-5 w-5" /> Anterior
                </button>
              ) : <div />}
              
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="flex items-center gap-2 px-5 py-2 bg-blue-600 font-bold rounded-full hover:bg-blue-700 transition-all">
                  Siguiente <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button type="submit" disabled={isLoading} className="px-5 py-2 bg-green-600 font-bold rounded-full hover:bg-green-700 disabled:opacity-70 transition-all">
                  {isLoading ? 'Creando cuenta...' : 'Finalizar Registro'}
                </button>
              )}
            </div>
          </form>
          
          {step > 1 && (
            <div className="mt-8 text-center">
              <p className="text-gray-300">¿Ya tienes una cuenta? <Link to="/login" className="font-bold text-white hover:underline">Inicia sesión</Link></p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
