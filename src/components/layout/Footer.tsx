
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';


export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook className="h-6 w-6" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Instagram className="h-6 w-6" />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Twitter className="h-6 w-6" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Mail className="h-6 w-6" />, href: 'mailto:info@manitasrd.com', label: 'Email' }
  ];

  const serviceCategories = [
    { name: 'Plomería', href: '/services/plumbing' },
    { name: 'Electricidad', href: '/services/electrical' },
    { name: 'Reparaciones', href: '/services/repairs' },
    { name: 'Limpieza', href: '/services/cleaning' },
  ];

  const companyLinks = [
    { name: 'Acerca de', href: '/about' },
    { name: 'Carreras', href: '/careers' },
    { name: 'Prensa', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ];

  const contactInfo = [
    { icon: <Phone className="h-5 w-5" />, text: '+1 (555) 123-4567' },
    { icon: <Mail className="h-5 w-5" />, text: 'info@manitasrd.com' },
    { icon: <MapPin className="h-5 w-5" />, text: '123 Main St, Ciudad' },
  ];

  return (
    <footer id="contact" className="bg-primary-950 text-white py-16 rounded-t-3xl mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Social Links */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-10 w-10 text-primary-400" />
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 text-transparent bg-clip-text">ManitasRD</span>
            </div>
            <p className="text-neutral-300 text-lg">
              La plataforma líder para servicios a domicilio de calidad premium.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-300 hover:text-white hover:bg-primary-900 rounded-full p-2"
                  aria-label={link.label}
                  onClick={() => window.open(link.href, '_blank')}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-300 text-transparent bg-clip-text">Servicios</h3>
            <ul className="space-y-4">
              {serviceCategories.map((category, index) => (
                <li key={index}>
                  <Link to={category.href} className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 group-hover:w-2 transition-all duration-200"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-300 text-transparent bg-clip-text">Compañía</h3>
            <ul className="space-y-4">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 group-hover:w-2 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-300 text-transparent bg-clip-text">Contacto</h3>
            <ul className="space-y-5">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center text-neutral-300 group hover:text-white transition-colors">
                  <div className="p-2 rounded-full bg-primary-900/50 mr-3 group-hover:bg-primary-800 transition-colors">
                    {info.icon}
                  </div>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-primary-900 text-center">
          <p className="text-neutral-400 text-sm">&copy; {currentYear} <span className="text-primary-400 font-medium">ManitasRD</span>. Todos los derechos reservados.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="/terminos" className="text-sm text-neutral-400 hover:text-white transition-colors">Términos de Servicio</a>
            <a href="/privacidad" className="text-sm text-neutral-400 hover:text-white transition-colors">Política de Privacidad</a>
            <a href="/cookies" className="text-sm text-neutral-400 hover:text-white transition-colors">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
