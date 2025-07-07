
import { MapPin, Phone, Wrench, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Wrench className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">ManitasRD</span>
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
                  <span>info@ManitasRD.com</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>123 Main St, Ciudad</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ManitasRD. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  )
}
