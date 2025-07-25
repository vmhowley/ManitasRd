import React from 'react';
import { User, Wrench, MessageSquare, Star } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const clientSteps = [
    {
      icon: <User size={40} className="text-blue-500" />,
      title: '1. Regístrate como Cliente',
      description: 'Crea tu cuenta en segundos para empezar a solicitar los servicios que necesites.',
    },
    {
      icon: <Wrench size={40} className="text-blue-500" />,
      title: '2. Solicita un Servicio',
      description: 'Busca entre servicios estándar o pide un presupuesto personalizado para trabajos más complejos.',
    },
    {
      icon: <MessageSquare size={40} className="text-blue-500" />,
      title: '3. Comunícate y Acuerda',
      description: 'Chatea con los técnicos, recibe propuestas y elige la que más te convenga.',
    },
    {
      icon: <Star size={40} className="text-blue-500" />,
      title: '4. Califica el Trabajo',
      description: 'Una vez completado el servicio, califica al técnico para ayudar a otros en la comunidad.',
    },
  ];

  const technicianSteps = [
    {
      icon: <User size={40} className="text-green-500" />,
      title: '1. Regístrate como Técnico',
      description: 'Crea tu perfil profesional, añade tus especialidades, experiencia y tarifa.',
    },
    {
      icon: <Wrench size={40} className="text-green-500" />,
      title: '2. Encuentra Oportunidades',
      description: 'Explora las solicitudes de servicio y presupuesto que coincidan con tus habilidades.',
    },
    {
      icon: <MessageSquare size={40} className="text-green-500" />,
      title: '3. Envía tu Propuesta',
      description: 'Comunícate con los clientes, envía cotizaciones claras y consigue el trabajo.',
    },
    {
      icon: <Star size={40} className="text-green-500" />,
      title: '4. Recibe tu Calificación',
      description: 'Un trabajo bien hecho te dará buenas calificaciones y atraerá más clientes.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">¿Cómo Funciona ManitasRD?</h1>
          <p className="mt-4 text-xl text-gray-600">Conectando clientes con técnicos expertos en 4 simples pasos.</p>
        </div>

        {/* For Clients */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Para Clientes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clientSteps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For Technicians */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Para Técnicos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicianSteps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorks;