
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

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
    <footer id="contact" className="bg-neutral-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Links */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">ManitasRD</span>
            </div>
            <p className="text-neutral-400">
              La plataforma líder para servicios a domicilio de calidad premium.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Button
                  key={index}
                  as="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-primary-900/20 rounded-full p-2"
                  aria-label={link.label}
                >
                  {link.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">Servicios</h3>
            <ul className="space-y-3">
              {serviceCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.href}
                    className="text-neutral-400 hover:text-white transition-colors hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">Compañía</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-white transition-colors hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">Contacto</h3>
            <address className="not-italic text-neutral-400 space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="text-primary-400 mr-3 mt-1">{item.icon}</div>
                  <p>{item.text}</p>
                </div>
              ))}
            </address>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
          <p>&copy; {currentYear} ManitasRD. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
