import {useState} from 'react'
import { Wrench, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png"
export const Header = () => {
  const navigate = useNavigate()
      const [isMenuOpen, setIsMenuOpen] = useState(false);
    
  return (
     <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <img src={logo} className="h-6 w-8" />
                <span className="ml-2 text-xl font-bold text-gray-900">ManitasRD</span>
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
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => navigate('register')}
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
                onClick={() => navigate('login')}
                className="block w-full text-left px-3 py-2 text-gray-600"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => navigate('register')}
                className="block w-full text-left px-3 py-2 bg-blue-600 text-white rounded-lg mt-2"
              >
                Ser Técnico
              </button>
            </div>
          </div>
        )}
      </header>
  )
}
