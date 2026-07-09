import { useRef, useState } from "react";
import { authAPI } from "../utils/api";

const RESEND_SECONDS = 30;

// Shared "send OTP -> verify OTP -> get a verifyToken" flow used by both
// Login and Register. `purpose` is "register" or "login" - the backend
// checks it so an OTP sent for one can't be replayed for the other.
const useEmailOtp = (purpose) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyToken, setVerifyToken] = useState(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    setResendIn(RESEND_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendIn((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async (email) => {
    setError("");
    setSending(true);
    try {
      await authAPI.sendOtp({ email, purpose });
      setOtpSent(true);
      startTimer();
    } catch (err) {
      setError(err.message || "Could not send OTP");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setError("");
    setVerifying(true);
    try {
      const { verifyToken: token } = await authAPI.verifyOtp({ email, otp, purpose });
      setVerifyToken(token);
      setOtpVerified(true);
      return token;
    } catch (err) {
      setError(err.message || "Invalid or expired OTP");
      throw err;
    } finally {
      setVerifying(false);
    }
  };

  const reset = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setVerifyToken(null);
    setError("");
    setResendIn(0);
    clearInterval(timerRef.current);
  };

  return {
    otpSent,
    otpVerified,
    verifyToken,
    sending,
    verifying,
    error,
    resendIn,
    sendOtp,
    verifyOtp,
    reset,
  };
};

export default useEmailOtp;