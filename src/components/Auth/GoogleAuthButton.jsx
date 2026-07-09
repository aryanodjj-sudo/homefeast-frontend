import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

// Wraps @react-oauth/google's <GoogleLogin> so Login.jsx and Register.jsx
// both get the same "Continue with Google" button - only the onSuccess
// handler (login vs register) differs per page.
const GoogleAuthButton = ({ onSuccess, onError, text = "continue_with" }) => {
  const [busy, setBusy] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setBusy(true);
    try {
      await onSuccess(credentialResponse.credential);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={busy ? "pointer-events-none opacity-60" : ""}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.("Google sign-in failed. Please try again.")}
        text={text}
        shape="pill"
        width="100%"
      />
    </div>
  );
};

export default GoogleAuthButton;