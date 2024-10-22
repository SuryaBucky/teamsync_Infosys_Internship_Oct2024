import React from 'react';
import { Snackbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { closeSnackbar } from '../redux/snackbarSlice';

const AppSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      severity={severity} // This line might need to be adjusted depending on Snackbar prop usage
    />
  );
};

export default AppSnackbar;
