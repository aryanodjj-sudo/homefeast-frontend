import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { authAPI } from "../utils/api";
import { validateRegisterForm, hasErrors } from "../utils/validators";
import Card from "../components/Common/Card";
import Input from "../components/Common/Input";
import Button from "../components/Common/Button";
import Alert from "../components/Common/Alert";
import useToast from "../hooks/useToast";

const Register = () => {
  const { login, loading, setLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

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

    const errors = validateRegisterForm(formData);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    try {
      setLoading(true);
      const result = await authAPI.register(formData);
      login(result);
      toast.success(`Welcome to HomeFeast, ${result.user.name.split(" ")[0]}! 🎉`);
      navigate("/", { replace: true });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">Create your account</h1>
        <p className="mb-6 text-gray-500">
          Join HomeFeast and start ordering homemade meals
        </p>

        {formError && (
          <div className="mb-4">
            <Alert type="error" message={formError} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            error={fieldErrors.name}
            autoComplete="name"
            required
          />

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
            label="Phone (optional)"
            type="tel"
            name="phone"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            error={fieldErrors.phone}
            autoComplete="tel"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            autoComplete="new-password"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;