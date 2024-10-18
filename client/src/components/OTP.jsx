import React, { useEffect, useState, useRef } from 'react';
import styled from "styled-components";
import { useTheme } from "styled-components";
import OtpInput from 'react-otp-input';
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from 'react-redux';
import { openSnackbar } from "../redux/snackbarSlice";
import axios from 'axios';
import { loginSuccess } from '../redux/userSlice'; // Import loginSuccess action
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

// Styled component for the title
const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 16px 22px;
`;

// Styled component for the outlined button
const OutlinedBox = styled.div`
  height: 44px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  margin: 3px 20px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 14px;
  ${({ googleButton, theme }) =>
        googleButton &&
        `user-select: none; gap: 16px;`}
  ${({ button, theme }) =>
        button &&
        `user-select: none; border: none; background: ${theme.itemHover}; color: '${theme.soft2}';`}
  ${({ activeButton, theme }) =>
        activeButton &&
        `user-select: none; border: none; background: ${theme.primary}; color: white;`}
`;

// Styled component for the login text
const LoginText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2};
  margin: 0px 26px 0px 26px;
`;

// Styled component for the span
const Span = styled.span`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  margin: 0px 26px 0px 26px;
`;

// Styled component for error messages
const Error = styled.div`
  color: red;
  font-size: 12px;
  margin: 2px 26px 8px 26px;
  display: block;
  ${({ error }) => error === "" && `display: none;`}
`;

// Styled component for the timer
const Timer = styled.div`
  color: ${({ theme }) => theme.soft2};
  font-size: 12px;
  margin: 2px 26px 8px 26px;
  display: block;
`;

// Styled component for the resend option
const Resend = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  margin: 2px 26px 8px 26px;
  display: block;
  cursor: pointer;
`;

/**
 * OTP Component for handling OTP verification.
 * @param {Object} props - Component properties.
 * @param {string} props.email - The user's email address.
 * @param {string} props.name - The user's name.
 * @param {boolean} props.otpVerified - Indicates if the OTP has been verified.
 * @param {Function} props.setOtpVerified - Function to set OTP verified state.
 * @param {string} props.reason - Reason for OTP verification.
 */

const OTP = ({ email, name, otpVerified, setOtpVerified, reason }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [otp, setOtp] = useState(''); // State for storing OTP input
    const [otpError, setOtpError] = useState(''); // State for storing OTP error messages
    const [otpLoading, setOtpLoading] = useState(false); // State to indicate loading status
    const [disabled, setDisabled] = useState(true); // State to control button enable/disable
    const [showTimer, setShowTimer] = useState(false); // State to show/hide timer
    const [otpSent, setOtpSent] = useState(false); // State to indicate if OTP has been sent
    const [timer, setTimer] = useState('00:00'); // State for timer display

    const Ref = useRef(null); // Reference for timer interval

    
    /**
     * Calculate the remaining time until the deadline.
     * @param {Date} e - The deadline date.
     * @returns {Object} - Object containing total time and minutes/seconds remaining.
     */
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return { total, minutes, seconds };
    };

    /**
     * Start the timer by calculating remaining time.
     * @param {Date} e - The deadline date.
     */
    const startTimer = (e) => {
        let { total, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':' +
                (seconds > 9 ? seconds : '0' + seconds)
            );
        }
    };

    /**
     * Clear the existing timer and start a new one.
     * @param {Date} e - The deadline date.
     */
    const clearTimer = (e) => {
        setTimer('01:00');
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    /**
     * Get the deadline time for OTP expiration.
     * @returns {Date} - The deadline date object.
     */
    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 60);
        return deadline;
    };

    /**
     * Resend the OTP and reset the timer.
     */
    const resendOtp = () => {
        setShowTimer(true);
        clearTimer(getDeadTime());
        sendOtp();
    };

    /**
     * Send the OTP to the user's email address via an API call.
     */
    const sendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:3001/user/verify', { email });
            if (response.status === 200) {
                dispatch(openSnackbar({
                    message: "OTP sent Successfully",
                    severity: "success",
                }));
                setDisabled(true);
                setOtp('');
                setOtpError('');
                setOtpLoading(false);
                setOtpSent(true);
            } else {
                dispatch(openSnackbar({
                    message: response.status,
                    severity: "error",
                }));
                setOtp('');
                setOtpError('');
                setOtpLoading(false);
            }
        } catch (err) {
            dispatch(openSnackbar({
                message: err.message,
                severity: "error",
            }));
        }
    };

    /**
     * Validate the entered OTP by sending it to the server for verification.
     */
    const validateOtp = async () => {
        setOtpLoading(true);
        setDisabled(true);
        try {
            const response = await axios.put('http://localhost:3001/user/verify', {
                email: email,
                registerOtp: otp
            });
    
            if (response.status === 200) {
                const token = response.data.token;
    
                dispatch(loginSuccess({ token }));
                localStorage.setItem('token', token);
                setOtpVerified(true);
                setOtp('');
                setOtpError('');
                setDisabled(false);
                dispatch(openSnackbar({
                    message: "OTP verified successfully!",
                    severity: "success",
                }));
                window.location.reload();
                navigate("/");
    
            } else {
                setOtpLoading(false);
                setDisabled(false);
                setOtpError(response.data.message);
                dispatch(openSnackbar({
                    message: response.data.message,
                    severity: "error",
                }));
            }
        } catch (err) {
            dispatch(openSnackbar({
                message: err.message,
                severity: "error",
            }));
            setOtpError(err.message);
        } finally {
            // Ensure loading state is reset in all cases
            setOtpLoading(false);
            setDisabled(false);
        }
    };
    // Effect to send OTP on component mount and start timer
    useEffect(() => {
        sendOtp();
        clearTimer(getDeadTime());
    }, []);

    // Effect to manage timer visibility based on countdown
    useEffect(() => {
        if (timer === '00:00') {
            setShowTimer(false);
        } else {
            setShowTimer(true);
        }
    }, [timer]);

     // Effect to enable/disable button based on OTP length
    useEffect(() => {
        if (otp.length === 6) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [otp]); // Dependency array: effect runs whenever 'otp' changes

    return (
        <div>
            <Title>VERIFY OTP</Title>
            <LoginText>A verification <b>&nbsp;OTP &nbsp;</b> has been sent to:</LoginText>
            <Span>{email}</Span>
            {!otpSent ? (
                <div style={{ padding: '12px 26px', marginBottom: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
                    Sending OTP<CircularProgress color="inherit" size={20} />
                </div>
            ) : (
                <div>
                    <OtpInput
                        value={otp}
                        onChange={setOtp} // Update OTP state on change
                        numInputs={6}
                        shouldAutoFocus={true}
                        inputStyle={{ fontSize: "22px", width: "38px", height: "38px", borderRadius: "5px", border: "1px solid #ccc", textAlign: "center", margin: "6px 4px", backgroundColor: 'transparent', color: theme.text }}
                        containerStyle={{ padding: '8px 2px', justifyContent: 'center' }}
                        renderInput={(props) => <input {...props} />}
                    />
                    <Error error={otpError}><b>{otpError}</b></Error>

                    <OutlinedBox
                        button={true}
                        activeButton={!disabled} // Button is active if not
                        style={{ marginTop: "12px", marginBottom: "12px" }}
                        onClick={validateOtp}
                    >
                        {otpLoading ? (
                            <CircularProgress color="inherit" size={20} />
                        ) : (
                            "Submit" // Button text when not loading
                        )}
                    </OutlinedBox>

                    {showTimer ? (
                        <Timer>Resend in <b>{timer}</b></Timer>
                    ) : (
                        <Resend onClick={resendOtp}><b>Resend</b></Resend> // Resend button when timer is not shown
                    )}
                </div>
            )}
        </div>
    );
};

export default OTP;