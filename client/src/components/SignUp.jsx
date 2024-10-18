import {
  CloseRounded,
  EmailRounded,
  PasswordRounded,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useTheme } from "styled-components";
import { IconButton, Modal } from "@mui/material";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import validator from "validator";
import axios from "axios";
import OTP from "./OTP";

const SignUp = ({ setSignUpOpen, setSignInOpen }) => {
  const [nameValidated, setNameValidated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [credentialError, setCredentialError] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [nameCorrect, setNameCorrect] = useState(false);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      dispatch(
        openSnackbar({
          message: "Please fill all the fields",
          severity: "error",
        })
      );
      return;
    }

    try {
      setLoading(true);
      dispatch(loginStart());

      const response = await axios.post("http://localhost:3001/user/signup", {
        email,
        name,
        password,
      });

      if (response.status === 201) {
        dispatch(
          openSnackbar({ message: "Account created successfully. Please verify your OTP.", severity: "success" })
        );
        setOtpSent(true);
      }
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setCredentialError(data.message);
        } else if (status === 500) {
          dispatch(openSnackbar({ message: "Internal Server Error", severity: "error" }));
        } else {
          dispatch(loginFailure());
          setCredentialError("An unexpected error occurred. Please try again.");
        }
      } else {
        dispatch(loginFailure());
        setCredentialError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email !== "") validateEmail();
    if (password !== "") validatePassword();
    if (name !== "") validateName();
    if (
      name !== "" &&
      validator.isEmail(email) &&
      passwordCorrect &&
      nameCorrect
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, passwordCorrect, password, nameCorrect]);

  const createAccount = () => {
    if (otpVerified) {
      dispatch(openSnackbar({ message: "Your account has been verified!", severity: "success" }));
    }
  };

  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid Email Id!");
    }
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setCredentialError("Password must be at least 8 characters long!");
      setPasswordCorrect(false);
    } else if (password.length > 16) {
      setCredentialError("Password must be less than 16 characters long!");
      setPasswordCorrect(false);
    } else if (
      !password.match(/[a-z]/g) ||
      !password.match(/[A-Z]/g) ||
      !password.match(/[0-9]/g) ||
      !password.match(/[^a-zA-Z\d]/g)
    ) {
      setPasswordCorrect(false);
      setCredentialError(
        "Password must contain at least one lowercase, uppercase, number, and special character!"
      );
    } else {
      setCredentialError("");
      setPasswordCorrect(true);
    }
  };

  const validateName = () => {
    if (name.length < 4) {
      setNameValidated(false);
      setNameCorrect(false);
      setCredentialError("Name must be at least 4 characters long!");
    } else {
      setNameCorrect(true);
      if (!nameValidated) {
        setCredentialError("");
        setNameValidated(true);
      }
    }
  };

  const theme = useTheme();

  return (
    <Modal open={true} onClose={() => setSignInOpen(false)}>
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 flex items-center justify-center">
        <div className="w-[360px] rounded-[30px] bg-white dark:bg-zinc-900 text-black dark:text-white p-3 flex flex-col relative">
          <CloseRounded
            className="absolute top-6 right-8 cursor-pointer"
            onClick={() => setSignUpOpen(false)}
          />
          {!otpSent ? (
            <>
              <h1 className="text-[22px] font-medium text-black dark:text-white mx-7 my-4">
                Sign Up
              </h1>
              <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 mx-5 my-[3px] text-sm flex justify-center items-center px-4 mt-6">
                <Person
                  sx={{ fontSize: "20px" }}
                  className="pr-3"
                />
                <input
                  className="w-full border-none text-sm rounded bg-transparent outline-none text-gray-600 dark:text-gray-300"
                  placeholder="Full Name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 mx-5 my-[3px] text-sm flex justify-center items-center px-4">
                <EmailRounded
                  sx={{ fontSize: "20px" }}
                  className="pr-3"
                />
                <input
                  className="w-full border-none text-sm rounded bg-transparent outline-none text-gray-600 dark:text-gray-300"
                  placeholder="Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mx-6 my-[2px] mb-2">
                  {emailError}
                </p>
              )}
              <div className="h-11 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 mx-5 my-[3px] text-sm flex justify-center items-center px-4">
                <PasswordRounded
                  sx={{ fontSize: "20px" }}
                  className="pr-3"
                />
                <input
                  className="w-full border-none text-sm rounded bg-transparent outline-none text-gray-600 dark:text-gray-300"
                  placeholder="Password"
                  type={values.showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <IconButton
                  onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
              {credentialError && (
                <p className="text-red-500 text-xs mx-6 my-[2px] mb-2">
                  {credentialError}
                </p>
              )}
              <div className="px-5">
                <button
                  onClick={handleSignUp}
                  disabled={disabled}
                  className={`w-full h-11 text-white rounded-md text-base mt-3 transition-colors
                    ${disabled 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                    }`}
                >
                  {Loading ? <CircularProgress color="inherit" size={24} /> : "Sign Up"}
                </button>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mx-5 my-5 mb-10 flex justify-center items-center">
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setSignInOpen(true);
                    setSignUpOpen(false);
                  }}
                >
                  Sign In
                </span>
              </p>
            </>
          ) : (
            <OTP email={email} setOtpVerified={setOtpVerified} createAccount={createAccount} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SignUp;