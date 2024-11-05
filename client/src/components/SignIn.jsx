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
import OTP from "./OTP";
import ResetPassword from "./ResetPassword";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userEmailState, userIdState, isAdminState, userNameState } from "../store/atoms/authAtoms";
import {jwtDecode} from "jwt-decode"

const SignIn = ({ setSignInOpen, setSignUpOpen }) => {
  const navigate = useNavigate();
  const setEmailRecoil = useSetRecoilState(userEmailState);
  const setIsAdminRecoil = useSetRecoilState(isAdminState);
  const setUserIdRecoil = useSetRecoilState(userIdState);
  const setNameRecoil = useSetRecoilState(userNameState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBlocked, setUserBlocked] = useState(false);
  const [needsOTPVerification, setNeedsOTPVerification] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [credentialError, setcredentialError] = useState("");

  useEffect(() => {
    if (email !== "") validateEmail();
    if (validator.isEmail(email) && password.length > 5) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

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
          `${isAdmin ? "http://localhost:3001/admin/signin" : "http://localhost:3001/user/signin"}`,
          { email, password }
        );

        setApiResponse(res);

        switch (res.status) {
          case 200:
            localStorage.setItem("token", res.data.token);
            const decoded = jwtDecode(res.data.token);
          
            setEmailRecoil(decoded.email);
            setIsAdminRecoil(!!decoded.admin_id);
            setUserIdRecoil(decoded.admin_id || decoded.user_id);
            setNameRecoil(res.data.name);
            localStorage.setItem("userName",res.data.name)
            localStorage.setItem("userEmail",decoded.email)
            localStorage.setItem("isAdmin",!!decoded.admin_id)
            localStorage.setItem("userId",decoded.admin_id || decoded.user_id)
            localStorage.setItem("userJoindate", res.data.joined_at )
            dispatch(loginSuccess(res.data));
            setIsLoggedIn(true);
            setSignInOpen(false);
            dispatch(
              openSnackbar({
                message: "Logged In Successfully",
                severity: "success",
              })
            );
            setTimeout(() => {
              console.log(isAdmin);
              if (!isAdmin) {
                navigate('/dashboard/user');
              }
              else {
                navigate('/dashboard/admin');
              }
            }, 100);
            break;

          case 401:
            setUserBlocked(true);
            dispatch(loginFailure());
            setcredentialError("Your account has been blocked. Please contact support.");
            dispatch(
              openSnackbar({
                message: "Account blocked",
                severity: "error",
              })
            );
            break;

          case 402:
            dispatch(
              openSnackbar({
                message: "Please verify your account",
                severity: "success",
              })
            );
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
        console.log(err);
        if (err.response) {
          switch (err.response.status) {
            case 400:
              setcredentialError("Invalid credentials");
              break;
            case 401:
              setUserBlocked(true);
              setcredentialError("Your account has been blocked. Please contact support.");
              break;
            case 402:
              setNeedsOTPVerification(true);
              setShowOTP(true);
              break;
            default:
              setcredentialError(err.response.data.errors[0] || "An error occurred");
          }
        } else {
          setcredentialError("Network error. Please try again.");
        }

        dispatch(loginFailure());
        dispatch(
          openSnackbar({
            message: credentialError,
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

  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid Email Id!");
    }
  };

  return !isLoggedIn ? (
    <Modal open={true} onClose={() => setSignInOpen(false)}>
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 flex items-center justify-center">
        {!resetPasswordOpen && (
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
                    {values.showPassword ? <Visibility className="text-xl" /> : <VisibilityOff className="text-xl" />}
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
                  onClick={() => setResetPasswordOpen(true)}
                >
                  <b>Forgot password?</b>
                </div>
                <div
                  className={`h-11 rounded-xl mx-5 mt-1.5 flex items-center justify-center text-sm font-medium cursor-pointer
                    ${disabled ? 'bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-blue-500 text-white'}`}
                  onClick={handleLogin}
                  disabled={disabled}
                >
                  {Loading ? <CircularProgress color="inherit" size={20} /> : "Sign In"}
                </div>
                <div
                  className="text-gray-500 dark:text-gray-400 text-sm mx-7 my-2 text-center cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                  onClick={() => {
                    setSignUpOpen(true);
                    setSignInOpen(false);
                  }}
                >
                  Don't have an account? <b>Sign Up</b>
                </div>
              </>
            )}
          </div>
        )}
        {resetPasswordOpen && (
          <ResetPassword 
            setResetPasswordOpen={setResetPasswordOpen} 
            setSignInOpen={setSignInOpen} 
          />
        )}
      </div>
    </Modal>
  ) : null;
};

export default SignIn;