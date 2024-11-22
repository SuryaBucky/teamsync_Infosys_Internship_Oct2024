import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importing global CSS styles
import App from './App'; // Main application component
import { store, persistor } from './redux/store'; // Redux store and persistor configuration
import { Provider } from 'react-redux'; // Provides Redux store to the app
import { PersistGate } from 'redux-persist/integration/react'; // Ensures state persistence before rendering
import { CookiesProvider } from "react-cookie"; // Enables cookie management

// Creating the React root for rendering the application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the application with necessary providers
root.render(
  <CookiesProvider> {/* Provides cookies context */}
    <Provider store={store}> {/* Provides Redux store to all components */}
      <PersistGate persistor={persistor}> {/* Waits for persisted state to rehydrate */}
        <App /> {/* Main application entry point */}
      </PersistGate>
    </Provider>
  </CookiesProvider>
);
