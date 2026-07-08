import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { contactAPI } from "../utils/api";
import { validateContactForm, hasErrors } from "../utils/validators";
import Card from "../components/Common/Card";
import Input from "../components/Common/Input";
import Button from "../components/Common/Button";
import Alert from "../components/Common/Alert";

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    subject: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(false);

    const errors = validateContactForm(formData);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    try {
      setSubmitting(true);
      await contactAPI.sendMessage(formData);
      toast.success("Your message has been sent! We'll get back to you soon. 🙏");
      setSubmitted(true);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setFormError(error.message || "Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Have a question, complaint, or feedback about your order? Send us a message
          and our team will get back to you as soon as possible.
        </p>

        <Card className="mt-8">
          {submitted && (
            <div className="mb-4">
              <Alert type="success" message="Thanks! Your query has been received." />
            </div>
          )}

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
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              error={fieldErrors.name}
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
            />

            <Input
              label="Subject (optional)"
              type="text"
              name="subject"
              placeholder="e.g. Order delay, wrong item, refund..."
              value={formData.subject}
              onChange={handleChange}
              error={fieldErrors.subject}
            />

            <div className="w-full">
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell us what's on your mind..."
                value={formData.message}
                onChange={handleChange}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-orange-500 dark:bg-gray-900 dark:text-white ${
                  fieldErrors.message
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              />
              {fieldErrors.message && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contact;