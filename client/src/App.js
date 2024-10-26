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


function App() {
  const snackbarState = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
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

          {/* Snackbar Component */}
          <Snackbar
            open={snackbarState.open}
            autoHideDuration={6000}
            onClose={handleClose}
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
