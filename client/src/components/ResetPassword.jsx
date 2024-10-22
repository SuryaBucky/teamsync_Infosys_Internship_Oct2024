import React, { useState, useEffect } from 'react';
import { CloseRounded, EmailRounded, PasswordRounded } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";

const PasswordResetForm = ({ email, setResetPasswordOpen, setSignInOpen }) => {
  const [resetOtp, setResetOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  const [errors, setErrors] = useState({
    password: [],
    confirmPassword: "",
    otp: ""
  });

  const validatePassword = (value) => {
    const errors = [];
    if (value.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(value)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(value)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(value)) {
      errors.push("Password must contain at least one special character (!@#$%^&*)");
    }
    return errors;
  };

  const validateConfirmPassword = (password, confirmValue) => {
    if (!confirmValue) return "Confirm password is required";
    if (password !== confirmValue) return "Passwords do not match";
    return "";
  };

  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword)
    }));
  }, [password, confirmPassword]);

  const handleSubmit = async () => {
    if (errors.password.length > 0 || errors.confirmPassword) {
      toast.error("Please fix all errors before submitting");
      return;
    }
  
    if (!resetOtp) {
      setErrors(prev => ({ ...prev, otp: "OTP is required" }));
      toast.error("OTP is required");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.put("http://localhost:3001/user/reset", {
        email,
        resetOtp,
        password
      });
  
      if (response.status === 201) {
        console.log("Password reset successful!"); // For Debugging
        toast.success("Password reset successful! Please login with your new password.");
        setResetPasswordOpen(false);  // Modal close should work here
        setSignInOpen(true);  // Open sign-in modal
      }
    } catch (err) {
      console.log("Error occurred", err);  // Log the error for debugging
      if (err.response?.status === 400) {
        toast.error("Invalid OTP. Please try again.");
      } else if (err.response?.status === 403) {
        toast.error("New password cannot be the same as your old password.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-y-4">
      <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 mt-6 flex items-center px-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={resetOtp}
          onChange={(e) => {
            setResetOtp(e.target.value);
            setErrors(prev => ({ ...prev, otp: "" }));
          }}
          className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
        />
      </div>
      {errors.otp && (
        <p className="text-red-500 text-xs mx-7 my-0.5">{errors.otp}</p>
      )}

      <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
        <PasswordRounded className="text-xl mr-3" />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
        />
      </div>
      {errors.password.map((error, index) => (
        <p key={index} className="text-red-500 text-xs mx-7 my-0.5">{error}</p>
      ))}

      <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 flex items-center px-4">
        <PasswordRounded className="text-xl mr-3" />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
        />
      </div>
      {errors.confirmPassword && (
        <p className="text-red-500 text-xs mx-7 my-0.5">{errors.confirmPassword}</p>
      )}

      <div
        onClick={handleSubmit}
        disabled={loading}
        className={`h-11 rounded-xl mx-5 mt-1.5 flex items-center justify-center text-sm font-medium cursor-pointer
          ${loading ? 'bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-blue-500 text-white'}`}
      >
        {loading ? (
          <CircularProgress size={20} className="text-inherit" />
        ) : (
          "Reset Password"
        )}
      </div>
    </div>
  );
};

const ResetPassword = ({ setResetPasswordOpen, setSignInOpen }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const dispatch = useDispatch();

  const handleSendOTP = async () => {
    if (!email) {
      setError("Email is required");
      dispatch(openSnackbar({
        message: "Email is required",
        severity: "error"
      }));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:3001/user/reset", { email });
      dispatch(openSnackbar({
        message: "Password reset OTP sent to your email!",
        severity: "success"
      }));
      setOtpSent(true);
    } catch (err) {
      const errorMessage = "Error sending reset OTP. Please try again.";
      setError(errorMessage);
      dispatch(openSnackbar({
        message: errorMessage,
        severity: "error"
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-[360px] rounded-[30px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 flex flex-col relative">
        <CloseRounded
          className="absolute top-6 right-8 cursor-pointer"
          onClick={() => setResetPasswordOpen(false)}
        />

        <div className="text-[22px] font-medium mx-7 my-4 text-center">
          Reset Password
        </div>

        {!otpSent ? (
          <div className="space-y-4">
            <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 mx-5 my-1 mt-6 flex items-center px-4">
              <EmailRounded className="text-xl mr-3" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mx-7 my-0.5">{error}</p>
            )}

            <div
              onClick={handleSendOTP}
              disabled={loading}
              className={`h-11 rounded-xl mx-5 mt-1.5 flex items-center justify-center text-sm font-medium cursor-pointer
                ${loading ? 'bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-blue-500 text-white'}`}
            >
              {loading ? (
                <CircularProgress size={20} className="text-inherit" />
              ) : (
                "Send OTP"
              )}
            </div>
          </div>
        ) : (
          <PasswordResetForm 
            email={email}
            setResetPasswordOpen={setResetPasswordOpen}
            setSignInOpen={setSignInOpen}
          />
        )}

        <div className="text-gray-500 dark:text-gray-400 text-sm mx-7 my-4 text-center">
          Remembered your password?{" "}
          <span
            onClick={() => {
              setResetPasswordOpen(false);
              setSignInOpen(true);
            }}
            className="text-blue-500 hover:underline cursor-pointer font-medium"
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;