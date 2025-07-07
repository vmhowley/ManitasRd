import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
// import { LandingPage } from '../pages/LandingPage';
import { ClientDashboard } from '../pages/ClientDashboard';
import { TechnicianDashboard } from '../pages/TechnicianDashboard';
import { AvailableRequests } from '../pages/AvailableRequests';
import { Messaging } from '../pages/Messaging';
import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { ServiceDetails } from '../pages/ServiceDetails';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/" element={<LandingPage />} /> */}
      <Route path="/" element={<Home />} />

      {/* Protected Routes for Clients */}
      <Route element={<ProtectedRoute allowedRoles={'client'} />}>
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/service-request" element={<ServiceRequestForm user={user} onNavigate={() => {}} onSubmit={() => {}} />} />
        <Route path="/messaging" element={<Messaging />} />
      </Route>

      {/* Protected Routes for Technicians */}
      <Route element={<ProtectedRoute allowedRoles={['technician']} />}>
        <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
        <Route path="/available-requests" element={<AvailableRequests />} />
        {/* Add other technician-specific routes here */}
      </Route>

      {/* Protected Routes for both Clients and Technicians */}
      <Route element={<ProtectedRoute allowedRoles={['client', 'technician']} />}>
        <Route path="/requests/:id" element={<ServiceDetails />} />
      </Route>

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
