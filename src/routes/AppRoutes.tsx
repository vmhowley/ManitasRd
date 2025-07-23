import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import HowItWorks from '../pages/HowItWorks';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
// import { LandingPage } from '../pages/LandingPage';
import { ClientDashboard } from '../pages/ClientDashboard';
import { TechnicianDashboard } from '../pages/TechnicianDashboard';
import { AvailableRequests } from '../pages/AvailableRequests';
import { Messaging } from '../pages/Messaging';
import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { ServiceDetails } from '../pages/ServiceDetails';
import { CustomQuoteRequest } from '../pages/CustomQuoteRequest';
import { TechnicianQuoteRequests } from '../pages/TechnicianQuoteRequests';
import { QuoteRequestDetails } from '../pages/QuoteRequestDetails';
import { RequestService } from '../pages/RequestService';
import ProtectedRoute from './ProtectedRoute';
// import { EditTechnicianProfile } from '../pages/EditTechnicianProfile';

const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* <Route path="/" element={<LandingPage />} /> */}
      <Route path="/" element={<Home />} />

      {/* Protected Routes for Clients */}
      <Route element={<ProtectedRoute allowedRoles={["client", "technician"]} />}>
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/service-request" element={<ServiceRequestForm />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/request-quote" element={<CustomQuoteRequest />} />
        <Route path="/request-service" element={<RequestService />} />
      </Route>

      {/* Protected Routes for Technicians */}
      <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
        <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
        <Route path="/available-requests" element={<AvailableRequests />} />
        <Route path="/technician-quote-requests" element={<TechnicianQuoteRequests />} />
        {/* <Route path="/edit-technician-profile" element={<EditTechnicianProfile />} /> */}
        {/* Add other technician-specific routes here */}
      </Route>

      {/* Protected Routes for both Clients and Technicians */}
      <Route element={<ProtectedRoute allowedRoles={["client", "technician"]} />}>
        <Route path="/requests/:id" element={<ServiceDetails />} />
        <Route path="/quote-request/:id" element={<QuoteRequestDetails />} />
      </Route>

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
