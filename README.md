# ManitasRd

ManitasRd is a platform designed to connect clients seeking various services with professional technicians. It facilitates service requests, custom quotes, communication, and reviews, aiming to streamline the process of finding and hiring skilled help.

## Features

*   **User Authentication:** Separate roles for Clients and Technicians.
*   **Service Request Management:** Clients can request standard services or custom quotes.
*   **Technician Profiles:** Technicians can list their specialties, experience, and hourly rates.
*   **Messaging System:** Enables direct communication between clients and technicians.
*   **Review and Rating System:** Allows clients to review completed services and rate technicians.
*   **File Uploads:** Support for uploading profile avatars and service-related images.
*   **Mobile Application:** Built with Capacitor for Android (and potentially iOS).
*   **UI Component Library:** Includes reusable UI components like:
    *   **Drawer Components:** Sliding panels for various use cases (notifications, chat, filters, etc.)
    *   **Layout Components:** Consistent page structure with header, footer, and navigation.

### UI Components

The application includes a comprehensive set of UI components, with special focus on the Drawer component system:

*   **Base Drawer:** Flexible sliding panel with customizable position, size, and behavior.
*   **Specialized Drawers:**
    *   **FilterDrawer:** For filtering search results.
    *   **NotificationsDrawer:** For displaying user notifications.
    *   **ChatDrawer:** For messaging between users and technicians.
    *   **ServiceCartDrawer:** For managing selected services.
    *   **UserProfileDrawer:** For managing user profile and settings.
    *   **TechnicianDashboardDrawer:** For displaying technician statistics and metrics.
    *   **HelpDrawer:** For displaying contextual help.

Detailed documentation for these components can be found in the [Components README](./src/components/README.md).

## Technologies Used

### Frontend

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Vite:** A fast build tool for modern web projects.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Capacitor:** An open-source native runtime for building cross-platform web apps.

### Backend (API)

*   **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL database.
*   **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   MongoDB (running locally or accessible via a cloud service like MongoDB Atlas)
*   Java Development Kit (JDK) for Android development

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ManitasRd1.git
    cd ManitasRd1
    ```

2.  **Backend Setup:**
    Navigate to the `api` directory, install dependencies, and set up environment variables.

    ```bash
    cd api
    npm install
    ```

    Create a `.env` file in the `api` directory with the following content:
    ```
    MONGO_URI="your_mongodb_connection_string"
    PORT=5000
    ```
    Replace `"your_mongodb_connection_string"` with your actual MongoDB connection string (e.g., `mongodb://localhost:27017/ManitasRd` or your Atlas URI).

    **Optional: Seed the database**
    To populate your database with initial service data, run the seed script: 
    ```bash
    node seed.js
    ```

3.  **Frontend Setup:**
    Navigate back to the project root directory and install frontend dependencies.

    ```bash
    cd .. # If you are in the api directory
    npm install
    ```

    Create a `.env` file in the project root directory with the following content:
    ```
    VITE_API_BASE_URL="http://localhost:5000/api"
    ```
    Ensure the port matches the `PORT` you set in your backend `.env` file.

### Running the Application

#### 1. Start the Backend Server

From the `api` directory:

```bash
cd api
npm start # Or 'node server.js' if no start script is defined
```
You should see a message like `Servidor corriendo en puerto 5000` and `Mongo conectado`.

#### 2. Start the Frontend Development Server (Web)

From the project root directory:

```bash
cd .. # If you are in the api directory
npm run dev
```
This will start the web application, usually accessible at `http://localhost:5173`.

#### 3. Run the Mobile Application (Android)

If you plan to run on an Android emulator or device:

```bash
npm install @capacitor/android # If not already installed
npx cap add android
npx cap sync android
npx cap open android
```
This will open your Android project in Android Studio, from where you can run it on an emulator or connected device.

## Project Structure

```
ManitasRd1/
├── api/                  # Backend Node.js (Express) API
│   ├── controllers/      # API route handlers
│   ├── middlewares/      # Express middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── .env              # Backend environment variables
│   ├── package.json      # Backend dependencies
│   ├── server.js         # Main backend server file
│   └── seed.js           # Database seeding script
├── android/              # Android project (generated by Capacitor)
├── public/               # Static assets for the web frontend
├── src/                  # Frontend React/TypeScript source code
│   ├── api/              # Frontend API configuration
│   ├── assets/           # Static assets for the frontend
│   ├── components/       # Reusable React components
│   │   ├── ui/           # Base UI components
│   │   │   └── Drawer/   # Drawer component and variants
│   │   ├── layout/       # Layout components (Header, Footer, etc.)
│   │   └── README.md     # Documentation for components
│   ├── context/          # React Context for global state (e.g., Auth)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # React components for different application pages
│   │   └── examples/     # Example pages for UI components
│   ├── routes/           # Frontend routing
│   ├── services/         # Frontend services for API interaction
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── .env                  # Frontend environment variables
├── capacitor.config.ts   # Capacitor configuration
├── package.json          # Frontend dependencies
├── README.md             # This file
└── vite.config.ts        # Vite build configuration
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
