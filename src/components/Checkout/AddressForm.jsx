import Input from "../Common/Input";

// Controlled delivery-address form. Owns no state itself - Checkout page
// holds { address, errors } and passes them down, so the same values can be
// bundled straight into the order object on submit.
const AddressForm = ({ address, errors, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="rounded-2xl border p-6 dark:border-gray-700">
      <h2 className="text-xl font-bold">Delivery Address</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          name="fullName"
          value={address.fullName}
          onChange={handleChange}
          error={errors.fullName}
          required
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={address.phone}
          onChange={handleChange}
          error={errors.phone}
          required
        />

        <div className="sm:col-span-2">
          <Input
            label="Address Line 1"
            name="addressLine1"
            placeholder="House no., street, area"
            value={address.addressLine1}
            onChange={handleChange}
            error={errors.addressLine1}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Address Line 2 (optional)"
            name="addressLine2"
            placeholder="Landmark, apartment, etc."
            value={address.addressLine2}
            onChange={handleChange}
          />
        </div>

        <Input
          label="City"
          name="city"
          value={address.city}
          onChange={handleChange}
          error={errors.city}
          required
        />
        <Input
          label="State"
          name="state"
          value={address.state}
          onChange={handleChange}
          error={errors.state}
          required
        />
        <Input
          label="Pincode"
          name="pincode"
          value={address.pincode}
          onChange={handleChange}
          error={errors.pincode}
          required
        />
      </div>
    </div>
  );
};

export default AddressForm;