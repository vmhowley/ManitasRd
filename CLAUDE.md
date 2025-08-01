# CodeViz Research Context

> **Note**: This file contains research context from CodeViz. Most recent contexts are at the bottom.

---

## Research Query

show me a diagram of all estructure

*Session: c72381f1b8dfff473c9e201169348a0f | Generated: 7/7/2025, 8:53:56*

### Analysis Summary

# Codebase Structure Diagram

This report outlines the high-level architecture and key components of the **SolucionaRd1** codebase, detailing their responsibilities and interconnections.

## High-Level Architecture

The **SolucionaRd1** application follows a client-server architecture, primarily divided into a **frontend** application and a **backend API**. The **frontend** is built with React and interacts with the **backend API** to manage data and business logic.

### **Backend API** [api/](api/)

The **backend API** is responsible for handling all server-side operations, including user authentication, service request management, and technician data. It exposes RESTful endpoints consumed by the frontend.

*   **Purpose**: Provides data and business logic services to the frontend, manages database interactions, and handles authentication/authorization.
*   **Internal Parts**:
    *   **Controllers** [api/controllers/](api/controllers/): Handle incoming requests, process data, and send responses.
        *   [auth.controller.js](api/controllers/auth.controller.js): Manages user authentication (login, registration).
        *   [solicitud.controller.js](api/controllers/solicitud.controller.js): Manages service request operations.
        *   [technician.controller.js](api/controllers/technician.controller.js): Manages technician-related operations.
    *   **Middlewares** [api/middlewares/](api/middlewares/): Intercept requests for tasks like authentication and logging.
        *   [auth.js](api/middlewares/auth.js): Handles authentication middleware.
    *   **Models** [api/models/](api/models/): Define the schema for database entities.
        *   [Solicitud.js](api/models/Solicitud.js): Defines the schema for service requests.
        *   [Users.js](api/models/Users.js): Defines the schema for user accounts.
    *   **Routes** [api/routes/](api/routes/): Define the API endpoints and map them to controller functions.
        *   [auth.routes.js](api/routes/auth.routes.js): Defines authentication-related routes.
        *   [solicitud.routes.js](api/routes/solicitud.routes.js): Defines service request routes.
        *   [technician.routes.js](api/routes/technician.routes.js): Defines technician-related routes.
    *   **Utilities** [api/utils/](api/utils/): Contains helper functions.
    *   **Configuration** [api/config/](api/config/): Stores application configuration.
    *   **Server Entry Point** [api/server.js](api/server.js): Initializes the Express server and connects to the database.
*   **External Relationships**: Communicates with a database (not explicitly shown in the file structure but implied by models) and serves API requests to the **frontend** application.

### **Frontend Application** [src/](src/)

The **frontend application** is a React-based single-page application that provides the user interface and interacts with the backend API.

*   **Purpose**: Renders the user interface, handles user interactions, and consumes data from the backend API.
*   **Internal Parts**:
    *   **Components** [src/components/](src/components/): Reusable UI elements.
        *   [ServiceRequestForm.tsx](src/components/ServiceRequestForm.tsx): Form for creating service requests.
        *   [TechnicianCard.tsx](src/components/TechnicianCard.tsx): Displays technician information.
        *   **Layout** [src/components/layout/](src/components/layout/): Common layout components.
            *   [Footer.tsx](src/components/layout/Footer.tsx)
            *   [Header.tsx](src/components/layout/Header.tsx)
    *   **Context** [src/context/](src/context/): Manages global state using React Context API.
        *   [AuthContext.tsx](src/context/AuthContext.tsx): Manages authentication state.
    *   **Hooks** [src/hooks/](src/hooks/): Custom React hooks for reusable logic.
    *   **Pages** [src/pages/](src/pages/): Top-level components representing different views/pages of the application.
        *   [AvailableRequests.tsx](src/pages/AvailableRequests.tsx)
        *   [ClientDashboard.tsx](src/pages/ClientDashboard.tsx)
        *   [Home.tsx](src/pages/Home.tsx)
        *   [LandingPage.tsx](src/pages/LandingPage.tsx)
        *   [Login.tsx](src/pages/Login.tsx)
        *   [Messaging.tsx](src/pages/Messaging.tsx)
        *   [Register.tsx](src/pages/Register.tsx)
        *   [ServiceDetails.tsx](src/pages/ServiceDetails.tsx)
        *   [TechnicianDashboard.tsx](src/pages/TechnicianDashboard.tsx)
        *   [TechnicianDetail.tsx](src/pages/TechnicianDetail.tsx)
    *   **Routes** [src/routes/](src/routes/): Defines client-side routing.
        *   [AppRoutes.tsx](src/routes/AppRoutes.tsx): Main application routes.
        *   [ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx): Handles protected routes requiring authentication.
    *   **Services** [src/services/](src/services/): Contains functions for interacting with the backend API.
        *   [authService.ts](src/services/authService.ts): Handles authentication API calls.
        *   [serviceRequestService.ts](src/services/serviceRequestService.ts): Handles service request API calls.
        *   [userService.ts](src/services/userService.ts): Handles user-related API calls.
    *   **Types** [src/types/](src/types/): TypeScript type definitions.
        *   [ServiceRequest.ts](src/types/ServiceRequest.ts)
        *   [Technician.ts](src/types/Technician.ts)
        *   [User.ts](src/types/User.ts)
    *   **Main Entry Point** [src/main.tsx](src/main.tsx): Renders the root React component.
    *   **API Configuration** [src/api/config.ts](src/api/config.ts): Configuration for API calls.
*   **External Relationships**: Makes HTTP requests to the **backend API** to fetch and send data.

### **Public Assets** [public/](public/)

This directory contains static assets served directly by the web server.

*   **Purpose**: Stores static files like images and icons that are publicly accessible.
*   **Internal Parts**:
    *   [vite.svg](public/vite.svg): Example SVG asset.
*   **External Relationships**: Accessed directly by the **frontend application** via URLs.

### **Node Modules** [node_modules/](node_modules/)

This directory contains all project dependencies installed via npm.

*   **Purpose**: Stores third-party libraries and packages required by both the frontend and backend.
*   **Internal Parts**: Contains numerous subdirectories, each representing an installed package.
*   **External Relationships**: Provides functionality to both the **frontend application** and the **backend API**.

