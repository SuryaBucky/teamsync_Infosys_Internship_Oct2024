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
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/">
              <Route index element={<Home />} />
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
  );
}

export default App;
