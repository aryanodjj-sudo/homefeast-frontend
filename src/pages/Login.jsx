import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { authAPI } from "../utils/api";
import { validateLoginForm, hasErrors } from "../utils/validators";
import Card from "../components/Common/Card";
import Input from "../components/Common/Input";
import Button from "../components/Common/Button";
import Alert from "../components/Common/Alert";
import useToast from "../hooks/useToast";

const Login = () => {
  const { login, loading, setLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateLoginForm(formData);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    try {
      setLoading(true);
      const result = await authAPI.login(formData);
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

        {formError && (
          <div className="mb-4">
            <Alert type="error" message={formError} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            autoComplete="email"
            required
          />

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

          <Button type="submit" className="w-full" disabled={loading}>
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