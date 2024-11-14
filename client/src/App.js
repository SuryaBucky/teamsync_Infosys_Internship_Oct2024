import './App.css'; // Global styles
import Home from './pages/Home/Home'; // Import Home page component
import AdminDashboard from './pages/Dashboard/admin-dashboard/AdminDashboard'; // Admin Dashboard component
import { ThemeProvider } from "styled-components"; // Theme provider for styled-components
import { RecoilRoot } from 'recoil'; // Recoil state management
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router for routing between pages
import { useSelector, useDispatch } from 'react-redux'; // Redux hooks to access state and dispatch actions
import Snackbar from '@mui/material/Snackbar'; // Snackbar component for notifications
import Alert from '@mui/material/Alert'; // Alert component inside Snackbar for displaying messages
import { closeSnackbar } from './redux/actions'; // Redux action to close the snackbar

// Define the theme for the app (dark theme in this case)
const darkTheme = {
  // You can define your theme properties here (colors, fonts, etc.)
  primary: '#333',
  secondary: '#555',
  // Add more theme properties if needed
};

// Main application component
function App() {
  // Get the current state of the snackbar from Redux
  const snackbarState = useSelector((state) => state.snackbar);

  // Dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  // Function to handle closing of the snackbar notification
  const handleClose = (event, reason) => {
    // Prevent snackbar from closing if the user clicks away
    if (reason === "clickaway") {
      return;
    }

    // Dispatch an action to close the snackbar
    dispatch(closeSnackbar());
  };

  return (
    // RecoilRoot provides the Recoil state management context to the application
    <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider theme={darkTheme}>
          {/* Define routes for the app */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            {/* Add more routes as needed */}
          </Routes>

          {/* Snackbar Component - Displays notifications to the user */}
          <Snackbar
            open={snackbarState.open} // Controls visibility of the snackbar
            autoHideDuration={6000}   // Snackbar auto-hides after 6 seconds
            onClose={handleClose}     // Callback function to handle the snackbar close event
          >
            {/* Alert Component inside Snackbar to show the notification message */}
            <Alert onClose={handleClose} severity={snackbarState.severity}>
              {snackbarState.message} {/* Message to be displayed in the alert */}
            </Alert>
          </Snackbar>
        </ThemeProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
