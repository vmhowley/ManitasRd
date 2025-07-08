import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Servicios', path: '/#services' },
    { name: 'Cómo Funciona', path: '/#how-it-works' },
    { name: 'Técnicos', path: '/#technicians' },
  ];

  const renderAuthButtons = (isMobile = false) => (
    <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center space-x-4'}`}>
      {user ? (
        <>
          <button
            onClick={() => navigate(user.type === 'client' ? '/client-dashboard' : '/technician-dashboard')}
            className="font-semibold hover:text-blue-500 transition-colors"
          >
            Mi Perfil
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold"
          >
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => navigate('/login')}
            className="font-semibold hover:text-blue-500 transition-colors"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
          >
            Regístrate
          </button>
        </>
      )}
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-white shadow-md text-gray-800' : 'bg-transparent text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="ManitasRD Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold">ManitasRD</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.path} className="font-semibold hover:text-blue-500 transition-colors">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">{renderAuthButtons()}</div>

          {/* Mobile Menu Button */}
          <button className="md:hidden z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-0 left-0 w-full bg-white text-gray-800 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ paddingTop: '80px' }} // Start content below header
      >
        <div className="flex flex-col items-center space-y-6 p-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-xl font-semibold hover:text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-6 border-t border-gray-200 w-full flex flex-col items-center">
            {renderAuthButtons(true)}
          </div>
        </div>
      </div>
    </header>
  );
};

