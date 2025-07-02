import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { LandingPage } from '../pages/LandingPage';
import { ClientDashboard } from '../pages/ClientDashboard';
import { TechnicianDashboard } from '../pages/TechnicianDashboard';
import { MessagingPage } from '../pages/Messaging';
import { ServiceRequestForm } from '../components/ServiceRequestForm';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />

      {/* Protected Routes for Clients */}
      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/service-request" element={<ServiceRequestForm user={user} onNavigate={() => {}} onSubmit={() => {}} />} />
        <Route path="/messaging" element={<MessagingPage />} />
        <Route path="/service-request" element={<ServiceRequestForm />} />
      </Route>

      {/* Protected Routes for Technicians */}
      <Route element={<ProtectedRoute allowedRoles={['technician']} />}>
        <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
        {/* Add other technician-specific routes here */}
      </Route>

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
