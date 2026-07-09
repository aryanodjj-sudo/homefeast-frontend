import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import useEmailOtp from "../hooks/useEmailOtp";
import { authAPI } from "../utils/api";
import { validateLoginForm, hasErrors, isValidEmail } from "../utils/validators";
import Card from "../components/Common/Card";
import Input from "../components/Common/Input";
import Button from "../components/Common/Button";
import Alert from "../components/Common/Alert";
import GoogleAuthButton from "../components/Auth/GoogleAuthButton";

const Login = () => {
  const { login, loading, setLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const otp = useEmailOtp("login");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otpValue, setOtpValue] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [googleError, setGoogleError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (formError) setFormError("");

    if (name === "email" && otp.otpVerified) {
      otp.reset();
    }
  };

  const handleSendOtp = async () => {
    if (!isValidEmail(formData.email)) {
      setFieldErrors((prev) => ({ ...prev, email: "Enter a valid email first" }));
      return;
    }
    await otp.sendOtp(formData.email);
    if (!otp.error) toast.success(`OTP sent to ${formData.email}`);
  };

  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) return;
    try {
      await otp.verifyOtp(formData.email, otpValue.trim());
      toast.success("Email verified ✓");
    } catch {
      // error already surfaced via otp.error
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setGoogleError("");
    try {
      setLoading(true);
      const result = await authAPI.googleAuth(credential);
      login(result);
      toast.success(`Welcome back, ${result.user.name.split(" ")[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setGoogleError(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateLoginForm(formData);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    if (!otp.otpVerified) {
      setFormError("Please verify your email with the OTP before continuing");
      return;
    }

    try {
      setLoading(true);
      const result = await authAPI.login({ ...formData, verifyToken: otp.verifyToken });
      login(result);
      toast.success(`Welcome back, ${result.user.name.split(" ")[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>
        <p className="mb-6 text-gray-500">
          Log in to order your favorite homemade meals
        </p>

        {googleError && (
          <div className="mb-4">
            <Alert type="error" message={googleError} />
          </div>
        )}

        <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={setGoogleError} text="signin_with" />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs font-medium text-gray-400">OR LOGIN WITH EMAIL</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>

        {formError && (
          <div className="mb-4">
            <Alert type="error" message={formError} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={fieldErrors.email}
                  autoComplete="email"
                  disabled={otp.otpVerified}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otp.sending || otp.otpVerified || otp.resendIn > 0}
                className="mb-[2px] shrink-0 rounded-xl border border-orange-500 px-4 py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-orange-500/10"
              >
                {otp.otpVerified
                  ? "Verified ✓"
                  : otp.sending
                  ? "Sending..."
                  : otp.resendIn > 0
                  ? `Resend (${otp.resendIn}s)`
                  : otp.otpSent
                  ? "Resend OTP"
                  : "Send OTP"}
              </button>
            </div>

            {otp.otpSent && !otp.otpVerified && (
              <div className="mt-3 flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label="Enter OTP"
                    type="text"
                    name="otp"
                    placeholder="6-digit code"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otp.verifying || otpValue.length !== 6}
                  className="mb-[2px] shrink-0 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {otp.verifying ? "Verifying..." : "Verify"}
                </button>
              </div>
            )}

            {otp.error && <p className="mt-1 text-sm text-red-500">{otp.error}</p>}
            {otp.otpVerified && (
              <p className="mt-1 text-sm text-green-600">Email verified successfully.</p>
            )}
          </div>

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            autoComplete="current-password"
            required
          />

          <Button type="submit" className="w-full" disabled={loading || !otp.otpVerified}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-orange-500 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;