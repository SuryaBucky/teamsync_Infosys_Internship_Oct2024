import React, { useState } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./pages/Home/components/Navbar";
import { darkTheme } from "./utils/Theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { closeSnackbar } from "./redux/snackbarSlice";
import ProjectDashboard from "./pages/Dashboard/project-dashboard/ProjectDashboard";
import AdminDashboard from "./pages/Dashboard/admin-dashboard/AdminDashboard";
import { RecoilRoot } from "recoil";
import styled from "styled-components";


// Main application component
function App() {
  // State for theme toggle
  const [isLightMode, setIsLightMode] = useState(true);

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.body.style.backgroundColor = isLightMode ? "#222" : "#f5f5f5";
  };

  // Get the current state of the snackbar from Redux
  const snackbarState = useSelector((state) => state.snackbar);
  // Dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  // Function to handle closing of the snackbar notification
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    // RecoilRoot provides the Recoil state management context to the application
    <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider theme={darkTheme}>   
          {/* Navbar */}
          <Navbar />

          {/* Drag-and-Drop Provider */}
          <DndProvider backend={HTML5Backend}>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/dashboard/user" element={<ProjectDashboard />} />
              <Route exact path="/dashboard/admin" element={<AdminDashboard />} />
            </Routes>

            {/* Snackbar */}
            <Snackbar
              open={snackbarState.open}
              autoHideDuration={6000}
              onClose={handleClose}
            >
              <Alert onClose={handleClose} severity={snackbarState.severity}>
                {snackbarState.message}
              </Alert>
            </Snackbar>
          </DndProvider>
        </ThemeProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
