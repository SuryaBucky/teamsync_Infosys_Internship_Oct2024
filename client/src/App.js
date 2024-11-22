import './App.css';
import Home from './pages/Home/Home';
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { closeSnackbar } from "./redux/snackbarSlice";
import ProjectDashboard from './pages/Dashboard/project-dashboard/ProjectDashboard';
import AdminDashboard from './pages/Dashboard/admin-dashboard/AdminDashboard';
import { RecoilRoot } from 'recoil';
// import Profile from './pages/Dashboard/profile/Profile';

// Main application component
function App() {
  // Get the current state of the snackbar from Redux
  const snackbarState = useSelector((state) => state.snackbar);
  // Dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  // Function to handle closing of the snackbar notification
  const handleClose = (event, reason) => {
    // Prevent snackbar from closing if user clicks away
    if (reason === "clickaway") {
      return;
    }
    // Dispatch an action to close the snackbar
    dispatch(closeSnackbar());
  };

  return (
    // RecoilRoot provides the Recoil state management context to the application
    <RecoilRoot>
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/">
              <Route index element={<Home />} />
            </Route>
            <Route exact path="/dashboard/user">
              <Route index element={<ProjectDashboard />} />
            </Route>
            {/* <Route exact path="/dashboard/profile">
              <Route index element={<Profile />} />
            </Route> */}
            <Route exact path="/dashboard/admin">
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>

          {/* Snackbar component to display notifications */}
          <Snackbar
            open={snackbarState.open}  // Controls if the snackbar is visible
            autoHideDuration={6000}    // Automatically hides the snackbar after 6 seconds
            onClose={handleClose}      // Callback function to handle close event
          >
            <Alert onClose={handleClose} severity={snackbarState.severity}>
              {snackbarState.message}     
            </Alert>
          </Snackbar>
        </BrowserRouter>
      </ThemeProvider>
    </DndProvider>
    </RecoilRoot>
  );
}

export default App;
