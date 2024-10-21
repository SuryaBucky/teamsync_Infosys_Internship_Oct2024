import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";
import axios from "axios";
import {
  CloseRounded,
  EmailRounded,
  Visibility,
  VisibilityOff,
  PasswordRounded,
} from "@mui/icons-material";
import { IconButton, Modal } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import { signIn, findUserByEmail, resetPassword } from "../api/index";
import OTP from "./OTP";

const SignIn = ({ setSignInOpen, setSignUpOpen }) => {// Functional component for Sign In
  const [email, setEmail] = useState("");// State to store email input
  const [password, setPassword] = useState("");// State to store password input
  const [Loading, setLoading] = useState(false);// State to manage loading status
  const [disabled, setDisabled] = useState(true); // State to manage button disabling
  const [values, setValues] = useState({// State for password visibility
    password: "",
    showPassword: false,
  });

  const [showOTP, setShowOTP] = useState(false);// State to manage OTP visibility
  const [otpVerified, setOtpVerified] = useState(false);// State to check if OTP is verified
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to manage forgot password visibility
  const [samepassword, setSamepassword] = useState("");// State for password match error messages
  const [newpassword, setNewpassword] = useState("");// State to store new password
  const [confirmedpassword, setConfirmedpassword] = useState("");// State to confirm new password
  const [passwordCorrect, setPasswordCorrect] = useState(false);// State to check if password is correct
  const [resetDisabled, setResetDisabled] = useState(false);// State to manage reset button disabling
  const [resettingPassword, setResettingPassword] = useState(false);// State to manage resetting password status
  const dispatch = useDispatch(); // Getting dispatch function from redux
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const [isLoggedIn, setIsLoggedIn] = useState(false);// State to check if user is logged in
  const [userBlocked, setUserBlocked] = useState(false);// State to check if user account is blocked
  const [needsOTPVerification, setNeedsOTPVerification] = useState(false);// State to check if OTP is needed
  const [apiResponse, setApiResponse] = useState(null);// State to store API response
  const [emailError, setEmailError] = useState("");// State for email validation errors
  const [credentialError, setcredentialError] = useState("");// State for credential errors
  const [otp, setOtp] = useState("");// State to store OTP input

  // Effect to validate email and password on change
  useEffect(() => {
    if (email !== "") validateEmail(); // Validate email if it's not empty
    if (validator.isEmail(email) && password.length > 5) {// Check if email is valid and password length is sufficient
      setDisabled(false);// Enable button if valid
    } else {
      setDisabled(true);// Disable button if invalid
    }
  }, [email, password]);

  // Effect to handle successful OTP verification and API response
  useEffect(() => {
    if (otpVerified && needsOTPVerification && apiResponse) {
      localStorage.setItem('token', apiResponse.data.token);// Store token in local storage
      dispatch(loginSuccess("Success")); // Dispatch success action
      setIsLoggedIn(true);// Update logged in state
      setSignInOpen(false);// Close sign-in modal
      dispatch(openSnackbar({ // Notify user of successful login
        message: "Logged In Successfully",
        severity: "success"
      }));
    }
  }, [otpVerified, needsOTPVerification, apiResponse]);

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();// Prevent default form submission
    
    if (!disabled) {// Proceed if the button is not disabled
      dispatch(loginStart());// Dispatch login start action
      setDisabled(true);
      setLoading(true);
      
      setUserBlocked(false);// Reset user blocked state
      setNeedsOTPVerification(false);
      setcredentialError("");
  
      try {
        // Send login request to appropriate endpoint based on admin status
        const res = await axios.post(
          `${isAdmin ? "http://localhost:3001/admin/signin" : "http://localhost:3001/user/signin"}`,
          { email, password }
        );

        setApiResponse(res);// Store API response
        console.log(res);// Log response for debugging
  
        switch (res.status) {// Handle different response statuses
          case 200:
            localStorage.setItem('token', res.data.token); // Store token in local storage
            dispatch(loginSuccess(res.data));// Dispatch success action with user data
            setIsLoggedIn(true);
            setSignInOpen(false);// Close sign-in modal
            dispatch(openSnackbar({// Notify user of successful login
              message: "Logged In Successfully",
              severity: "success"
            }));
            break;
  
          case 401:
            setUserBlocked(true);// Mark user as blocked
            dispatch(loginFailure());// Dispatch login failure action
            setcredentialError("Your account has been blocked. Please contact support.");
            dispatch(openSnackbar({// Notify user of account block
              message: "Account blocked",
              severity: "error"
            }));
            break;
  
          case 402:
             // Notify user to verify their account
            //give snackbar too
            dispatch(openSnackbar({
              message: "Please verify your account",
              severity: "success"
            }));
            setNeedsOTPVerification(true); // Set state for OTP verification
            setShowOTP(true); // Show OTP input
            break;
  
          case 400:
            dispatch(loginFailure());// Dispatch login failure action
            setcredentialError(res.data.errors[0]);// Set credential error message
            dispatch(openSnackbar({// Notify user of error
              message: `Error: ${res.data.errors[0]}`,
              severity: "error"
            }));
            break;
  
          default:
            dispatch(loginFailure());
            setcredentialError(`Unexpected Error: ${res.data}`);
        }
      } catch (err) {
        console.log(err);// Log error for debugging
        if (err.response) { // Check if error has a response
          switch (err.response.status) { // Handle different response statuses
            case 400:
              setcredentialError("Invalid credentials");// Set invalid credentials error
              break;
            case 401:
              setUserBlocked(true);// Mark user as blocked
              setcredentialError("Your account has been blocked. Please contact support.");
              break;
            case 402:
              setNeedsOTPVerification(true);// Set state for OTP verification
              setShowOTP(true);// Show OTP input
              break;
            default:
              setcredentialError(err.response.data.errors[0] || "An error occurred");// Set generic error message
          }
        } else {// Handle errors without a response
          setcredentialError("Network error. Please try again.");// Set network error message
        }
        
        dispatch(loginFailure());// Dispatch login failure action
        dispatch(openSnackbar({// Notify user of error
          message: credentialError,
          severity: "error"
        }));
      } finally {
        setLoading(false);// Hide loading indicator
        setDisabled(false); // Enable button
      }
    }
  
    if (email === "" || password === "") {// Check if fields are empty
      dispatch(openSnackbar({// Notify user to fill all fields
        message: "Please fill all the fields",
        severity: "error"
      }));
    }
  };

  // Function to validate email format
  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");// Clear email error if valid
    } else {
      setEmailError("Enter a valid Email Id!");// Set email error if invalid
    }
  };

   // Function to validate password strength and criteria
  const validatePassword = () => {
    if (newpassword.length < 8) {// Check if password is too short
      setSamepassword("Password must be atleast 8 characters long!");
      setPasswordCorrect(false);
    } else if (newpassword.length > 16) {// Check if password is too long
      setSamepassword("Password must be less than 16 characters long!");
      setPasswordCorrect(false);// Set password correctness state
    } else if (
      !newpassword.match(/[a-z]/g) ||
      !newpassword.match(/[A-Z]/g) ||
      !newpassword.match(/[0-9]/g) ||
      !newpassword.match(/[^a-zA-Z\d]/g)
    ) {// Check for character diversity in password
      setPasswordCorrect(false);
      setSamepassword(
        "Password must contain atleast one lowercase, uppercase, number and special character!"
      );
    }
    else {
      setSamepassword("");
      setPasswordCorrect(true);
    }
  };

  // Effect to validate password and check for confirmation match
  useEffect(() => {
    // Validate new password if it is not empty
    if (newpassword !== "") validatePassword();
    // Check if the password is correct and both new and confirmed passwords match
    if (
      passwordCorrect
      && newpassword === confirmedpassword
    ) {
      setSamepassword("");// Clear any password mismatch message
      setResetDisabled(false); // Enable reset button
    } else if (confirmedpassword !== "" && passwordCorrect) {
      setSamepassword("Passwords do not match!");// Set mismatch message
      setResetDisabled(true);// Disable reset button
    }
  }, [newpassword, confirmedpassword]);// Run effect when newpassword or confirmedpassword changes

  // Function to send OTP to the user for password reset
  const sendOtp = async () => {
    console.log('Sending OTP request...');

    // Check if the reset button is not disabled
    if (!resetDisabled) {
      setResetDisabled(true);
      setLoading(true);

      try {
        // Send POST request to reset password
        const res = await axios.post("http://localhost:3001/user/reset", {
          email: email.trim(), // Use trimmed email to avoid issues with whitespace
        });

        if (res.status === 200) {
          setShowOTP(true); // Show the OTP input field if successful
          setEmailError(""); // Clear any previous email errors
          dispatch(
            openSnackbar({
              message: "OTP sent to your email. Please check and verify.",
              severity: "success",
            })
          );
        }
      } catch (error) {
        setLoading(false);
        setResetDisabled(false);

         // Check if the error response is from the server
        if (error.response) {
          const { status, data } = error.response;// Destructure status and data from the error response
          console.log('Error response data:', data);// Log error response for debugging

          // Handle specific error messages from the backend
          if (status === 400) {
            setEmailError(data.errors ? data.errors[0] : "User not found!");
            dispatch(
              openSnackbar({
                message: data.errors ? data.errors[0] : "Request failed. Please try again.",
                severity: "error",
              })
            );
          } else if (status === 500) {
            // Handle server error
            dispatch(
              openSnackbar({
                message: "Oops! Something went wrong on the server side. Please try again later.",
                severity: "error",
              })
            );
          } else {
            // Handle unexpected status codes
            setEmailError("An unexpected error occurred. Please try again.");
            dispatch(
              openSnackbar({
                message: "An unexpected error occurred. Please try again.",
                severity: "error",
              })
            );
          }
        } else {
          // Handle network or other unexpected errors
          console.error('Request failed:', error.message);
          dispatch(
            openSnackbar({
              message: error.message,// Notify user of network error
              severity: "error",
            })
          );
        }
      } finally {
        setLoading(false);// Hide loading indicator
        setResetDisabled(false);// Re-enable the reset button
      }
    }
  };

  const performResetPassword = useCallback(async () => {
     // Check if the OTP has been verified before proceeding with password reset
    if (otpVerified) {
      setShowOTP(false);
      setResettingPassword(true);
  
      try {
        // Send a PUT request to the server to reset the password
        const res = await fetch('http://localhost:3001/user/reset', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',// Specify the content type for the request
          },
          body: JSON.stringify({ 
            email, 
            password: confirmedpassword, 
            resetOtp: otp // Make sure `otp` is the variable holding the user's OTP input
          }),
        });
  
        // Check if the password reset was successful
        if (res.status === 200) {
          dispatch(
            openSnackbar({
              message: "Password Reset Successfully",
              severity: "success",
            })
          );
          // Reset all relevant state values after successful password reset
          setShowForgotPassword(false);
          setEmail("");
          setNewpassword("");
          setConfirmedpassword("");
          setOtpVerified(false);
          setResettingPassword(false);
        } else if (res.status === 400) {
          // Handle case where OTP verification failed or request was invalid
          dispatch(
            openSnackbar({
              message: "OTP verification failed or invalid request.",
              severity: "error",
            })
          );
          setShowOTP(true); // Show OTP input again for the user to retry
          setOtpVerified(false);
          setResettingPassword(false);
        }
      } catch (err) {
        // Handle case where OTP verification failed or request was invalid
        dispatch(
          openSnackbar({
            message: err.message,// Notify the user of the error
            severity: "error",
          })
        );
        setShowOTP(false);
        setOtpVerified(false);
        setResettingPassword(false);
      }
    }
  }, [otpVerified, email, confirmedpassword, otp, dispatch]);// Dependencies for useCallback

  const closeForgetPassword = () => {
    setShowForgotPassword(false)// Close the forgot password view
    setShowOTP(false)// Hide the OTP input field
  }

  useEffect(() => {
    // Call performResetPassword when OTP is verified
    if (otpVerified) {
      performResetPassword();
    }
  }, [otpVerified, performResetPassword]);// Dependencies for useEffect
  
  // Main return statement for rendering the component
  return !isLoggedIn ? (
    <Modal open={true} onClose={() => setSignInOpen(false)}>
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 flex items-center justify-center">
        {!showForgotPassword ? (
          <div className="w-[360px] rounded-[30px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 flex flex-col relative">
            <CloseRounded
              className="absolute top-6 right-8 cursor-pointer"
              onClick={() => setSignInOpen(false)}
            />
            {needsOTPVerification && showOTP ? (
              <OTP 
                email={email} 
                name="User" 
                otpVerified={otpVerified} 
                setOtpVerified={setOtpVerified} 
                reason="LOGIN" 
              />
            ) : (
              <>
                <div className="text-[22px] font-medium mx-7 my-4 text text-center">Sign In</div>
                <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 mt-6 flex items-center px-4">
                  <EmailRounded className="text-xl mr-3" />
                  <input
                    className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                    placeholder="Email Id"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {emailError && <div className="text-red-500 text-xs mx-7 my-0.5">{emailError}</div>}
                <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
                  <PasswordRounded className="text-xl mr-3" />
                  <input
                    className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                    placeholder="Password"
                    type={values.showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    color="inherit"
                    onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
                  >
                    {values.showPassword ? (
                      <Visibility className="text-xl" />
                    ) : (
                      <VisibilityOff className="text-xl" />
                    )}
                  </IconButton>
                </div>
                <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 mt-3 flex items-center px-4">
                  <input
                    type="checkbox"
                    id="admin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="mr-3"
                  />
                  <label htmlFor="admin">Admin</label>
                </div>
                {credentialError && <div className="text-red-500 text-xs mx-7 my-0.5">{credentialError}</div>}
                {userBlocked && <div className="text-red-500 text-xs mx-7 my-0.5">{credentialError}</div>}
                <div 
                  className="text-gray-500 dark:text-gray-400 text-sm mx-7 my-2 text-right cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                  onClick={() => setShowForgotPassword(true)}
                >
                  <b>Forgot password ?</b>
                </div>
                <div
                  className={`h-11 rounded-xl mx-5 mt-1.5 flex items-center justify-center text-sm font-medium cursor-pointer
                    ${disabled ? 'bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-blue-500 text-white'}`}
                  onClick={handleLogin}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Sign In"
                  )}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mx-5 my-5 flex justify-center items-center">
                  Don't have an account ?
                  <span
                    className="text-blue-500 dark:text-blue-400 ml-1.5 cursor-pointer"
                    onClick={() => {
                      setSignUpOpen(true);
                      setSignInOpen(false);
                    }}
                  >
                    Create Account
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-[360px] rounded-[30px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 flex flex-col relative">
            <CloseRounded
              className="absolute top-6 right-8 cursor-pointer"
              onClick={closeForgetPassword}
            />
            {!showOTP ? (
              <>
                <div className="text-[22px] font-medium mx-7 my-4">Reset Password</div>
                  {resettingPassword ? (
                    <div className="px-7 pb-5 text-center flex flex-col items-center gap-3.5 justify-center">
                      Updating password
                      <CircularProgress color="inherit" size={20} />
                    </div>
                  ) : (
                    <>
                      {/* Display Email and OTP fields if OTP is not verified */}
                      {!otpVerified ? (
                        <>
                          {/* Email Input Field */}
                          <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 mt-6 flex items-center px-4">
                            <EmailRounded className="text-xl mr-3" />
                            <input
                              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                              placeholder="Email Id"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          {emailError && <div className="text-red-500 text-xs mx-7 my-0.5">{emailError}</div>}

                          {/* Get OTP Button */}
                          {!showOTP && (
                            <div
                              className={`h-11 rounded-xl mx-5 mt-1.5 mb-6 flex items-center justify-center text-sm font-medium cursor-pointer
                                          ${resetDisabled ? 'bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-blue-500 text-white'}`}
                              onClick={sendOtp}
                            >
                              {Loading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : (
                                "Get OTP"
                              )}
                            </div>
                          )}
                          {/* OTP Input Field */}
                          {showOTP && (
                            <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
                              <input
                                className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                                placeholder="Enter OTP"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                              />
                            </div>
                          )}

                          {/* Verify OTP Button */}
                          {showOTP && (
                            <div
                              className={`h-11 rounded-xl mx-5 mt-1.5 mb-6 flex items-center justify-center text-sm font-medium cursor-pointer
                                          ${resetDisabled ? 'bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-blue-500 text-white'}`}
                              onClick={() => setOtpVerified(true)} // Replace with actual OTP verification logic if needed
                            >
                              {Loading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : (
                                "Verify OTP"
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* New Password Fields after OTP verification */}
                          <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 mt-6 flex items-center px-4">
                            <EmailRounded className="text-xl mr-3" />
                            <input
                              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                              placeholder="Email Id"
                              type="email"
                              value={email}
                              disabled
                            />
                          </div>
                          <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
                            <PasswordRounded className="text-xl mr-3" />
                            <input
                              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                              placeholder="New Password"
                              type={values.showPassword ? "text" : "password"}
                              value={newpassword}
                              onChange={(e) => setNewpassword(e.target.value)}
                            />
                          </div>
                          <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
                            <PasswordRounded className="text-xl mr-3" />
                            <input
                              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                              placeholder="Confirm Password"
                              type={values.showPassword ? "text" : "password"}
                              value={confirmedpassword}
                              onChange={(e) => setConfirmedpassword(e.target.value)}
                            />
                            <IconButton
                              color="inherit"
                              onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
                            >
                              {values.showPassword ? (
                                <Visibility className="text-xl" />
                              ) : (
                                <VisibilityOff className="text-xl" />
                              )}
                            </IconButton>
                          </div>
                          {samepassword && <div className="text-red-500 text-xs mx-7 my-0.5">{samepassword}</div>}

                          {/* Submit Button for Password Reset */}
                          <div
                            className={`h-11 rounded-xl mx-5 mt-1.5 mb-6 flex items-center justify-center text-sm font-medium cursor-pointer
                                      ${resetDisabled ? 'bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-blue-500 text-white'}`}
                            onClick={performResetPassword}
                          >
                            {Loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : (
                              "Reset Password"
                            )}
                          </div>
                        </>
                      )}

                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mx-5 my-5 flex justify-center items-center">
                        Don't have an account?
                        <span
                          className="text-blue-500 dark:text-blue-400 ml-1.5 cursor-pointer"
                          onClick={() => {
                            setSignUpOpen(true);
                            setSignInOpen(false);
                          }}
                        >
                          Create Account
                        </span>
                      </div>
                  </>
                )}
              </>
            ) : (
              <OTP 
                email={email} 
                name="User" 
                otpVerified={otpVerified} 
                setOtpVerified={setOtpVerified} 
                reason="FORGOTPASSWORD" 
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  ) : null;
};

export default SignIn;