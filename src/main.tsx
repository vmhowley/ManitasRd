import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>

  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider >
            <ToastProvider>
              <App />
            </ToastProvider>
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
  </StrictMode>

)
