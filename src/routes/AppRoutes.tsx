import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import HowItWorks from '../pages/HowItWorks';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
// import { LandingPage } from '../pages/LandingPage';
import { ClientDashboard } from '../pages/ClientDashboard';
import { AvailableRequests } from '../pages/AvailableRequests';
import { Messaging } from '../pages/Messaging';
import { Chat } from '../pages/Chat';
import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { ServiceDetails } from '../pages/ServiceDetails';
import { CustomQuoteRequest } from '../pages/CustomQuoteRequest';
import { TechnicianQuoteRequests } from '../pages/TechnicianQuoteRequests';
import { QuoteRequestDetails } from '../pages/QuoteRequestDetails';
import { RequestService } from '../pages/RequestService';
import ProtectedRoute from './ProtectedRoute';
// import { EditTechnicianProfile } from '../pages/EditTechnicianProfile';

// Drawer Examples
import ExamplesIndexPage from '../pages/examples';
import DrawerShowcasePage from '../pages/examples/drawer-showcase';
import UserProfileDrawerExamplePage from '../pages/examples/user-profile-drawer-example';
import ChatDrawerExamplePage from '../pages/examples/chat-drawer-example';
import ServiceCartDrawerExamplePage from '../pages/examples/service-cart-drawer-example';
import TechnicianDashboardDrawerExamplePage from '../pages/examples/technician-dashboard-drawer-example';
import FilterDrawerExamplePage from '../pages/examples/filter-drawer-example';
import NotificationsDrawerExamplePage from '../pages/examples/notifications-drawer-example';
import HelpDrawerExamplePage from '../pages/examples/help-drawer-example';
import { UIImprovementsExample as UIImprovementsExamplePage } from '../examples/ui-improvements-example';

// Add imports
import { ClientHome } from '../pages/ClientHome';
import { TechnicianHome } from '../pages/TechnicianHome';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* General Home for non-authenticated users */}
      <Route path="/" element={<Home />} />
      
      {/* Specific Home pages for authenticated users */}
      <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
        <Route path="/client-home" element={<ClientHome />} />
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
        <Route path="/technician-home" element={<TechnicianHome />} />
      </Route>

      {/* Protected Routes for Clients */}
      <Route element={<ProtectedRoute allowedRoles={["client", "technician"]} />}>
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/service-request" element={<ServiceRequestForm />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/chat/:otherUserId/:serviceRequestId" element={<Chat />} />
        <Route path="/request-quote" element={<CustomQuoteRequest />} />
        <Route path="/request-service" element={<RequestService />} />
      </Route>

      {/* Protected Routes for Technicians */}
      <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
        <Route path="/technician-dashboard" element={<Navigate to="/technician-home" replace />} />
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

      {/* Ejemplos de Drawer */}
      <Route path="/examples" element={<ExamplesIndexPage />} />
      <Route path="/examples/drawer-showcase" element={<DrawerShowcasePage />} />
      <Route path="/examples/user-profile-drawer-example" element={<UserProfileDrawerExamplePage />} />
      <Route path="/examples/chat-drawer-example" element={<ChatDrawerExamplePage />} />
      <Route path="/examples/service-cart-drawer-example" element={<ServiceCartDrawerExamplePage />} />
      <Route path="/examples/technician-dashboard-drawer-example" element={<TechnicianDashboardDrawerExamplePage />} />
      <Route path="/examples/filter-drawer-example" element={<FilterDrawerExamplePage />} />
      <Route path="/examples/notifications-drawer-example" element={<NotificationsDrawerExamplePage />} />
      <Route path="/examples/help-drawer-example" element={<HelpDrawerExamplePage />} />
      <Route path="/examples/ui-improvements-example" element={<UIImprovementsExamplePage />} />
      
      {/* Fallback for unmatched routes */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
