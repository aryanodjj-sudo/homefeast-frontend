import { useRef, useState } from "react";
import { authAPI } from "../utils/api";

const RESEND_SECONDS = 30;

// Shared "send OTP -> verify OTP -> get a verifyToken" flow used by both
// Login and Register. `purpose` is "register" or "login". For login, the
// backend may respond with otpRequired: false (admin accounts) - in that
// case this hook marks the email as verified immediately, skipping the
// OTP-entry step entirely.
const useEmailOtp = (purpose) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyToken, setVerifyToken] = useState(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [skipped, setSkipped] = useState(false); // true when OTP wasn't required at all (e.g. admin login)
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
      const result = await authAPI.sendOtp({ email, purpose });

      if (result?.otpRequired === false) {
        // Admin account - no OTP needed, treat email as already verified.
        setOtpSent(false);
        setOtpVerified(true);
        setVerifyToken(null);
        setSkipped(true);
        return;
      }

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
    setSkipped(false);
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
    skipped,
    sendOtp,
    verifyOtp,
    reset,
  };
};

export default useEmailOtp;