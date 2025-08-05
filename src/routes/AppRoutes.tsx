import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import HowItWorks from '../pages/HowItWorks';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
// import { LandingPage } from '../pages/LandingPage';
import { ClientDashboard } from '../pages/ClientDashboard';
import { ClientHome } from '../pages/ClientHome';
import { AvailableRequests } from '../pages/AvailableRequests';
import { Messaging } from '../pages/Messaging';
import { Chat } from '../pages/Chat';
import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { ServiceDetails } from '../pages/ServiceDetails';
import { CustomQuoteRequest } from '../pages/CustomQuoteRequest';
import { TechnicianQuoteRequests } from '../pages/TechnicianQuoteRequests';
import { TechnicianHome } from '../pages/TechnicianHome';
import { QuoteRequestDetails } from '../pages/QuoteRequestDetails';
import { RequestService } from '../pages/RequestService';
import ProtectedRoute from './ProtectedRoute';
import { EditTechnicianProfile } from '../pages/EditTechnicianProfile';
import { Categories } from '../pages/Categories';
import { Profile } from '../pages/Profile';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/categories" element={<Categories />} />
      
      {/* General Home for non-authenticated users */}
      
      {/* Specific Home pages for authenticated users */}
      <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
        <Route path="/client-home" element={<ClientHome />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/service-request" element={<ServiceRequestForm />} />
        <Route path="/request-quote" element={<CustomQuoteRequest />} />
        <Route path="/request-service" element={<RequestService />} />
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
        <Route path="/technician-home" element={<TechnicianHome />} />
      </Route>

      {/* Protected Routes for Clients */}
      <Route element={<ProtectedRoute allowedRoles={["client", "technician"]} />}>
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/chat/:otherUserId/:serviceRequestId" element={<Chat />} />
        <Route path="/requests/:id" element={<ServiceDetails />} />
        <Route path="/quote-request/:id" element={<QuoteRequestDetails />} />
      <Route path="/profile" element={<Profile />} />
        <Route path="/technician-dashboard" element={<Navigate to="/technician-home" replace />} />
        <Route path="/available-requests" element={<AvailableRequests />} />
        <Route path="/technician-quote-requests" element={<TechnicianQuoteRequests />} />
        <Route path="/edit-profile" element={<EditTechnicianProfile />} />
      </Route>

      {/* Protected Routes for Technicians */}
      <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
        {/* Add other technician-specific routes here */}
      </Route>

      
      {/* Fallback for unmatched routes */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
