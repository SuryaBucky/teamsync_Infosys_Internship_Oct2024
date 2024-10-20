import React, { useState, useEffect } from "react";
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

/**
 * SignIn component handles the user authentication process.
 * It manages the state for email, password, loading status, and other UI elements.
 * It also handles the login and password reset functionalities.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setSignInOpen - Function to set the sign-in modal open state.
 * @param {Function} props.setSignUpOpen - Function to set the sign-up modal open state.
 * @returns {ReactNode} A React element that renders the sign-in form.
 */
const SignIn = ({ setSignInOpen, setSignUpOpen }) => {
  // State variables for managing input fields and UI states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  // State variables for OTP and password reset functionalities
  const [showOTP, setShowOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [samepassword, setSamepassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmedpassword, setConfirmedpassword] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [resetDisabled, setResetDisabled] = useState(true);
  const [resettingPassword, setResettingPassword] = useState(false);
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBlocked, setUserBlocked] = useState(false);
  const [needsOTPVerification, setNeedsOTPVerification] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [credentialError, setcredentialError] = useState("");

  /**
   * useEffect to validate email and password fields.
   * Enables or disables the login button based on validation.
   */
  useEffect(() => {
    if (email !== "") validateEmail();
    if (validator.isEmail(email) && password.length > 5) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  /**
   * useEffect to handle successful OTP verification.
   * Logs in the user and updates the UI accordingly.
   */
  useEffect(() => {
    if (otpVerified && needsOTPVerification && apiResponse) {
      localStorage.setItem("token", apiResponse.data.token);
      dispatch(loginSuccess("Success"));
      setIsLoggedIn(true);
      setSignInOpen(false);
      dispatch(
        openSnackbar({
          message: "Logged In Successfully",
          severity: "success",
        })
      );
    }
  }, [otpVerified, needsOTPVerification, apiResponse]);

  /**
   * Function to handle user login.
   * Sends login request to the server and handles different response statuses.
   *
   * @param {Event} e - The event object.
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!disabled) {
      dispatch(loginStart());
      setDisabled(true);
      setLoading(true);

      setUserBlocked(false);
      setNeedsOTPVerification(false);
      setcredentialError("");

      try {
        const res = await axios.post(
          `${
            isAdmin
              ? "http://localhost:3001/admin/signin"
              : "http://localhost:3001/user/signin"
          }`,
          { email, password }
        );

        setApiResponse(res);

        switch (res.status) {
          case 200:
            localStorage.setItem("token", res.data.token);
            dispatch(loginSuccess(res.data));
            setIsLoggedIn(true);
            setSignInOpen(false);
            dispatch(
              openSnackbar({
                message: "Logged In Successfully",
                severity: "success",
              })
            );
            break;

          case 401:
            setUserBlocked(true);
            dispatch(loginFailure());
            setcredentialError(
              "Your account has been blocked. Please contact support."
            );
            dispatch(
              openSnackbar({
                message: "Account blocked",
                severity: "error",
              })
            );
            break;

          case 402:
            setNeedsOTPVerification(true);
            setShowOTP(true);
            break;

          case 400:
            dispatch(loginFailure());
            setcredentialError(res.data.errors[0]);
            dispatch(
              openSnackbar({
                message: `Error: ${res.data.errors[0]}`,
                severity: "error",
              })
            );
            break;

          default:
            dispatch(loginFailure());
            setcredentialError(`Unexpected Error: ${res.data}`);
        }
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setUserBlocked(true);
              setcredentialError(
                "Your account has been blocked. Please contact support."
              );
              break;
            case 402:
              setNeedsOTPVerification(true);
              setShowOTP(true);
              break;
            default:
              setcredentialError(
                err.response.data.message || "An error occurred"
              );
          }
        } else {
          setcredentialError("Network error. Please try again.");
        }

        dispatch(loginFailure());
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      } finally {
        setLoading(false);
        setDisabled(false);
      }
    }

    if (email === "" || password === "") {
      dispatch(
        openSnackbar({
          message: "Please fill all the fields",
          severity: "error",
        })
      );
    }
  };

  /**
   * Function to validate the email format.
   * Sets an error message if the email is invalid.
   */
  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid Email Id!");
    }
  };

  /**
   * Function to validate the new password.
   * Checks for length and character requirements.
   */
  const validatePassword = () => {
    if (newpassword.length < 8) {
      setSamepassword("Password must be at least 8 characters long!");
      setPasswordCorrect(false);
    } else if (newpassword.length > 16) {
      setSamepassword("Password must be less than 16 characters long!");
      setPasswordCorrect(false);
    } else if (
      !newpassword.match(/[a-z]/g) ||
      !newpassword.match(/[A-Z]/g) ||
      !newpassword.match(/[0-9]/g) ||
      !newpassword.match(/[^a-zA-Z\d]/g)
    ) {
      setPasswordCorrect(false);
      setSamepassword(
        "Password must contain at least one lowercase, uppercase, number, and special character!"
      );
    } else {
      setSamepassword("");
      setPasswordCorrect(true);
    }
  };

  /**
   * useEffect to validate password and confirm password fields.
   * Enables or disables the reset button based on validation.
   */
  useEffect(() => {
    if (newpassword !== "") validatePassword();
    if (passwordCorrect && newpassword === confirmedpassword) {
      setSamepassword("");
      setResetDisabled(false);
    } else if (confirmedpassword !== "" && passwordCorrect) {
      setSamepassword("Passwords do not match!");
      setResetDisabled(true);
    }
  }, [newpassword, confirmedpassword]);

  /**
   * Function to send OTP for password reset.
   * Finds user by email and handles the response.
   */
  const sendOtp = () => {
    if (!resetDisabled) {
      setResetDisabled(true);
      setLoading(true);
      findUserByEmail(email)
        .then((res) => {
          if (res.status === 200) {
            setShowOTP(true);
            setResetDisabled(false);
            setLoading(false);
          } else if (res.status === 202) {
            setEmailError("User not found!");
            setResetDisabled(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setResetDisabled(false);
          setLoading(false);
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        });
    }
  };

  /**
   * Function to perform password reset after OTP verification.
   * Sends reset password request to the server.
   */
  const performResetPassword = async () => {
    if (otpVerified) {
      setShowOTP(false);
      setResettingPassword(true);
      await resetPassword(email, confirmedpassword)
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              openSnackbar({
                message: "Password Reset Successfully",
                severity: "success",
              })
            );
            setShowForgotPassword(false);
            setEmail("");
            setNewpassword("");
            setConfirmedpassword("");
            setOtpVerified(false);
            setResettingPassword(false);
          }
        })
        .catch((err) => {
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
          setShowOTP(false);
          setOtpVerified(false);
          setResettingPassword(false);
        });
    }
  };

  /**
   * Function to close the forgot password modal.
   * Resets the OTP and forgot password states.
   */
  const closeForgetPassword = () => {
    setShowForgotPassword(false);
    setShowOTP(false);
  };

  /**
   * useEffect to trigger password reset process after OTP verification.
   */
  useEffect(() => {
    performResetPassword();
  }, [otpVerified]);

  /**
   * Render the SignIn component UI.
   * Displays the login or password reset form based on the state.
   */
  return !isLoggedIn ? (
    <Modal open={true} onClose={() => setSignInOpen(false)}>
      {/* Overlay for the modal */}
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 flex items-center justify-center">
        {/* Conditional rendering based on whether the forgot password is shown */}
        {!showForgotPassword ? (
          // Sign In form
          <div className="w-[360px] rounded-[30px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 flex flex-col relative">
            {/* Close button for the modal */}
            <CloseRounded
              className="absolute top-6 right-8 cursor-pointer"
              onClick={() => setSignInOpen(false)}
            />
            {/* Conditional rendering for OTP verification */}
            {needsOTPVerification && showOTP ? (
              // OTP component for verification
              <OTP
                email={email}
                name="User"
                otpVerified={otpVerified}
                setOtpVerified={setOtpVerified}
                reason="LOGIN"
              />
            ) : (
              <>
                {/* Sign In title */}
                <div className="text-[22px] font-medium mx-7 my-4">Sign In</div>
                {/* Email input field */}
                <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 mt-6 flex items-center px-4">
                  <EmailRounded className="text-xl mr-3" />
                  <input
                    className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                    placeholder="Email Id"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Display email error if any */}
                {emailError && (
                  <div className="text-red-500 text-xs mx-7 my-0.5">
                    {emailError}
                  </div>
                )}
                {/* Password input field */}
                <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
                  <PasswordRounded className="text-xl mr-3" />
                  <input
                    className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                    placeholder="Password"
                    type={values.showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* Toggle password visibility */}
                  <IconButton
                    color="inherit"
                    onClick={() =>
                      setValues({
                        ...values,
                        showPassword: !values.showPassword,
                      })
                    }
                  >
                    {values.showPassword ? (
                      <Visibility className="text-xl" />
                    ) : (
                      <VisibilityOff className="text-xl" />
                    )}
                  </IconButton>
                </div>
                {/* Admin checkbox */}
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
                {/* Display credential error if any */}
                {credentialError && (
                  <div className="text-red-500 text-xs mx-7 my-0.5">
                    {credentialError}
                  </div>
                )}
                {userBlocked && (
                  <div className="text-red-500 text-xs mx-7 my-0.5">
                    {credentialError}
                  </div>
                )}
                {/* Forgot password link */}
                <div
                  className="text-gray-500 dark:text-gray-400 text-sm mx-7 my-2 text-right cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                  onClick={() => setShowForgotPassword(true)}
                >
                  <b>Forgot password ?</b>
                </div>
                {/* Sign In button */}
                <div
                  className={`h-11 rounded-xl mx-5 mt-1.5 flex items-center justify-center text-sm font-medium cursor-pointer
                    ${
                      disabled
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-500"
                        : "bg-blue-500 text-white"
                    }`}
                  onClick={handleLogin}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Sign In"
                  )}
                </div>
                {/* Link to create a new account */}
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
          // Reset Password form
          <div className="w-[360px] rounded-[30px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 flex flex-col relative">
            {/* Close button for the modal */}
            <CloseRounded
              className="absolute top-6 right-8 cursor-pointer"
              onClick={closeForgetPassword}
            />
            {/* Conditional rendering for OTP verification */}
            {!showOTP ? (
              <>
                {/* Reset Password title */}
                <div className="text-[22px] font-medium mx-7 my-4">
                  Reset Password
                </div>
                {resettingPassword ? (
                  // Loading indicator while resetting password
                  <div className="px-7 pb-5 text-center flex flex-col items-center gap-3.5 justify-center">
                    Updating password
                    <CircularProgress color="inherit" size={20} />
                  </div>
                ) : (
                  <>
                    {/* Email input field for password reset */}
                    <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 mt-6 flex items-center px-4">
                      <EmailRounded className="text-xl mr-3" />
                      <input
                        className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                        placeholder="Email Id"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {/* Display email error if any */}
                    {emailError && (
                      <div className="text-red-500 text-xs mx-7 my-0.5">
                        {emailError}
                      </div>
                    )}
                    {/* New password input field */}
                    <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
                      <PasswordRounded className="text-xl mr-3" />
                      <input
                        className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                        placeholder="New Password"
                        type="text"
                        onChange={(e) => setNewpassword(e.target.value)}
                      />
                    </div>
                    {/* Confirm password input field */}
                    <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
                      <PasswordRounded className="text-xl mr-3" />
                      <input
                        className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
                        placeholder="Confirm Password"
                        type={values.showPassword ? "text" : "password"}
                        onChange={(e) => setConfirmedpassword(e.target.value)}
                      />
                      {/* Toggle password visibility */}
                      <IconButton
                        color="inherit"
                        onClick={() =>
                          setValues({
                            ...values,
                            showPassword: !values.showPassword,
                          })
                        }
                      >
                        {values.showPassword ? (
                          <Visibility className="text-xl" />
                        ) : (
                          <VisibilityOff className="text-xl" />
                        )}
                      </IconButton>
                    </div>
                    {/* Display password match error if any */}
                    {samepassword && (
                      <div className="text-red-500 text-xs mx-7 my-0.5">
                        {samepassword}
                      </div>
                    )}
                    {/* Submit button for password reset */}
                    <div
                      className={`h-11 rounded-xl mx-5 mt-1.5 mb-6 flex items-center justify-center text-sm font-medium cursor-pointer
                        ${
                          resetDisabled
                            ? "bg-gray-200 dark:bg-gray-800 text-gray-500"
                            : "bg-blue-500 text-white"
                        }`}
                      onClick={() => sendOtp()}
                    >
                      {Loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        "Submit"
                      )}
                    </div>
                    {/* Link to create a new account */}
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
              </>
            ) : (
              // OTP component for password reset
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
