import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  // Forzamos el tema oscuro como predeterminado
  const [theme, setTheme] = useState<Theme>('dark');
  
  // Aplicamos el tema oscuro inmediatamente
  useEffect(() => {
    localStorage.setItem('theme', 'dark');
  }, []);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Eliminar clases anteriores
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Eliminar atributos data-theme anteriores
    if (root.hasAttribute('data-theme')) {
      root.removeAttribute('data-theme');
    }
    
    // Determinar si debe aplicarse el modo oscuro
    let darkMode = false;
    
    if (theme === 'dark') {
      darkMode = true;
    } else if (theme === 'system') {
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Aplicar la clase correspondiente al elemento html y al body
    root.classList.add(darkMode ? 'dark' : 'light');
    body.classList.add(darkMode ? 'dark' : 'light');
    
    // Aplicar el atributo data-theme
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    
    setIsDarkMode(darkMode);
    
    // Guardar el tema en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        setIsDarkMode(mediaQuery.matches);
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
    isDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};