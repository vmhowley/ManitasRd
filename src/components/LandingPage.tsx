import React, { useState } from 'react';
import { Search, MapPin, Star, Shield, Clock, CheckCircle, Phone, MessageCircle, Calendar, Wrench, Zap, Droplets, Paintbrush, Scissors, Car, Home, Wifi, Menu, X, ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const services = [
  { id: 1, name: 'Plomería', icon: Droplets, color: 'bg-blue-500', jobs: '2,450+' },
  { id: 2, name: 'Electricidad', icon: Zap, color: 'bg-yellow-500', jobs: '1,890+' },
  { id: 3, name: 'Reparaciones', icon: Wrench, color: 'bg-gray-600', jobs: '3,200+' },
  { id: 4, name: 'Pintura', icon: Paintbrush, color: 'bg-green-500', jobs: '1,540+' },
  { id: 5, name: 'Belleza', icon: Scissors, color: 'bg-pink-500', jobs: '980+' },
  { id: 6, name: 'Automotriz', icon: Car, color: 'bg-red-500', jobs: '1,200+' },
  { id: 7, name: 'Limpieza', icon: Home, color: 'bg-purple-500', jobs: '2,100+' },
  { id: 8, name: 'Tecnología', icon: Wifi, color: 'bg-indigo-500', jobs: '890+' },
];

const featuredTechnicians = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    specialty: 'Plomería',
    rating: 4.9,
    reviews: 324,
    price: '$25/hora',
    distance: '2.3 km',
    verified: true,
    image: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
  },
  {
    id: 2,
    name: 'Ana Rodríguez',
    specialty: 'Electricidad',
    rating: 4.8,
    reviews: 256,
    price: '$30/hora',
    distance: '1.8 km',
    verified: true,
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
  },
  {
    id: 3,
    name: 'Miguel Torres',
    specialty: 'Reparaciones',
    rating: 4.9,
    reviews: 189,
    price: '$28/hora',
    distance: '3.1 km',
    verified: true,
    image: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
  },
  {
    id: 4,
    name: 'Laura García',
    specialty: 'Limpieza',
    rating: 4.7,
    reviews: 412,
    price: '$20/hora',
    distance: '1.2 km',
    verified: true,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
  }
];

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTechIndex, setCurrentTechIndex] = useState(0);

  const nextTechnician = () => {
    setCurrentTechIndex((prev) => (prev + 1) % featuredTechnicians.length);
  };

  const prevTechnician = () => {
    setCurrentTechIndex((prev) => (prev - 1 + featuredTechnicians.length) % featuredTechnicians.length);
  };

  const handleSearch = () => {
    if (searchQuery.trim() || location.trim()) {
      // Redirect to search results or service categories
      console.log('Searching for:', searchQuery, 'in', location);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
                <Wrench className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">HomePro</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Servicios</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">Cómo Funciona</a>
              <a href="#technicians" className="text-gray-600 hover:text-blue-600 transition-colors">Técnicos</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contacto</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('login')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ser Técnico
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#services" className="block px-3 py-2 text-gray-600">Servicios</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-600">Cómo Funciona</a>
              <a href="#technicians" className="block px-3 py-2 text-gray-600">Técnicos</a>
              <a href="#contact" className="block px-3 py-2 text-gray-600">Contacto</a>
              <button 
                onClick={() => onNavigate('login')}
                className="block w-full text-left px-3 py-2 text-gray-600"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="block w-full text-left px-3 py-2 bg-blue-600 text-white rounded-lg mt-2"
              >
                Ser Técnico
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                ¿Necesitas un técnico
                <span className="text-yellow-400"> en tu zona?</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Conectamos con técnicos verificados y certificados. Precios transparentes, garantía total.
              </p>
              
              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="¿Qué servicio necesitas?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tu ubicación"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-400" />
                  <span>Técnicos Verificados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span>Garantía Total</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-400" />
                  <span>Disponible 24/7</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/8844896/pexels-photo-8844896.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1" 
                  alt="Técnico profesional"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">+15,000</p>
                      <p className="text-sm text-gray-600">Servicios Completados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Technicians Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Técnicos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Profesionales verificados con las mejores calificaciones
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center justify-center">
              <button
                onClick={prevTechnician}
                className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
                {featuredTechnicians.slice(currentTechIndex, currentTechIndex + 3).map((tech) => (
                  <div key={tech.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="relative">
                      <img 
                        src={tech.image} 
                        alt={tech.name}
                        className="w-full h-48 object-cover"
                      />
                      {tech.verified && (
                        <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{tech.name}</h3>
                        <span className="text-sm text-gray-600">{tech.distance}</span>
                      </div>
                      
                      <p className="text-blue-600 font-medium mb-3">{tech.specialty}</p>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-semibold">{tech.rating}</span>
                        </div>
                        <span className="text-gray-500 text-sm ml-2">({tech.reviews} reseñas)</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">{tech.price}</span>
                        <div className="flex space-x-2">
                          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Phone className="h-4 w-4" />
                          </button>
                          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onNavigate('login')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Contratar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={nextTechnician}
                className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {featuredTechnicians.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTechIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTechIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categorías de Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra el técnico perfecto para cualquier trabajo en tu hogar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group cursor-pointer"
                  onClick={() => onNavigate('login')}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                    <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.jobs} trabajos</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Tres simples pasos para obtener el servicio que necesitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Busca y Reserva</h3>
              <p className="text-gray-600">
                Encuentra el técnico perfecto, ve precios transparentes y reserva en segundos
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Programa tu Cita</h3>
              <p className="text-gray-600">
                Elige el horario que mejor te convenga, incluso el mismo día
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Trabajo Completado</h3>
              <p className="text-gray-600">
                Recibe un servicio de calidad con garantía y califica tu experiencia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ventajas de usar HomePro
            </h2>
            <p className="text-xl text-blue-100">
              Somos diferentes a otras plataformas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Verificados</h3>
              <p className="text-blue-100 text-sm">Todos nuestros técnicos pasan por verificación exhaustiva</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Garantía Total</h3>
              <p className="text-blue-100 text-sm">Garantizamos la calidad de cada trabajo realizado</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Disponible 24/7</h3>
              <p className="text-blue-100 text-sm">Servicios de emergencia disponibles todo el día</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Precios Justos</h3>
              <p className="text-blue-100 text-sm">Tarifas transparentes sin sorpresas al final</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshot Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Descarga nuestra App
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Accede a todos nuestros servicios desde tu móvil. Disponible para iOS y Android.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on App Store" className="h-8" />
                </button>
                <button className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-8" />
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1" 
                  alt="App Screenshot"
                  className="rounded-3xl shadow-2xl max-w-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Wrench className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">HomePro</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plataforma líder para servicios a domicilio de calidad premium.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Plomería</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Electricidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reparaciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Limpieza</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Compañía</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@homepro.com</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>123 Main St, Ciudad</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HomePro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}