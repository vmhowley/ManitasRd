import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import HowItWorks from "../pages/HowItWorks";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
// import { LandingPage } from '../pages/LandingPage';
import { ClientDashboard } from "../pages/ClientDashboard";
import { AvailableRequests } from "../pages/AvailableRequests";
import { Messaging } from "../pages/Messaging";
import { Chat } from "../pages/Chat";
import { ServiceRequestForm } from "../components/ServiceRequestForm";
import { ServiceDetails } from "../pages/ServiceDetails";
import { CustomQuoteRequest } from "../pages/CustomQuoteRequest";
import { TechnicianQuoteRequests } from "../pages/TechnicianQuoteRequests";
import { QuoteRequestDetails } from "../pages/QuoteRequestDetails";
import { RequestService } from "../pages/RequestService";
import ProtectedRoute from "./ProtectedRoute";
import { EditTechnicianProfile } from "../pages/EditTechnicianProfile";
import { Categories } from "../pages/Categories";
import { Profile } from "../pages/Profile";
import { ScrollToTop } from "../components/layout/ScrollToTop";
import { TechnicianDashboard } from "../pages/TechnicianDashboard";
import { PageTransition } from "../components/layout/PageTransition";
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password/:token" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/categories" element={<PageTransition><Categories /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />

        {/* General Home for non-authenticated users */}

        {/* Specific Home pages for authenticated users */}
        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route path="/booking" element={<PageTransition><ClientDashboard /></PageTransition>} />
          <Route path="/service-request" element={<PageTransition><ServiceRequestForm /></PageTransition>} />
          <Route path="/request-quote" element={<PageTransition><CustomQuoteRequest /></PageTransition>} />
          <Route path="/request-service" element={<PageTransition><RequestService /></PageTransition>} />
        </Route>


        {/* Protected Routes for Clients */}
        <Route
          element={<ProtectedRoute allowedRoles={["client", "technician"]} />}
        >
          <Route path="/messaging" element={<PageTransition><Messaging /></PageTransition>} />
          <Route
            path="/chat/:otherUserId/:serviceRequestId"
            element={<PageTransition><Chat /></PageTransition>}
          />
          <Route path="/requests/:id" element={<PageTransition><ServiceDetails /></PageTransition>} />
          <Route path="/quote-request/:id" element={<PageTransition><QuoteRequestDetails /></PageTransition>} />
         
          <Route path="/available-requests" element={<PageTransition><AvailableRequests /></PageTransition>} />
          <Route
            path="/technician-quote-requests"
            element={<PageTransition><TechnicianQuoteRequests /></PageTransition>}
          />
          <Route path="/edit-profile" element={<PageTransition><EditTechnicianProfile /></PageTransition>} />
        </Route>

        {/* Protected Routes for Technicians */}
        <Route element={<ProtectedRoute allowedRoles={["technician"]} />}>
          <Route path="/technician-dashboard" element={<PageTransition><TechnicianDashboard /></PageTransition>} />
          {/* Add other technician-specific routes here */}
        </Route>

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
