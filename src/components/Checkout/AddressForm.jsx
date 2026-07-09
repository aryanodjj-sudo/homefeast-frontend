import { useEffect, useRef, useState } from "react";
import Input from "../Common/Input";
import Select from "../Common/Select";
import { INDIAN_STATES, CITIES_BY_STATE } from "../../data/indiaLocations";

// Matches the state name returned by the pincode API against our
// INDIAN_STATES list - names/casing sometimes differ slightly
// (e.g. "ODISHA" vs "Odisha", "NCT OF DELHI" vs "Delhi").
const matchStateName = (apiState) => {
  if (!apiState) return "";
  const normalized = apiState.trim().toLowerCase();
  const found = INDIAN_STATES.find(
    (s) =>
      s.toLowerCase() === normalized ||
      normalized.includes(s.toLowerCase()) ||
      s.toLowerCase().includes(normalized)
  );
  return found || apiState;
};

// Controlled delivery-address form. Owns no state itself (except pincode
// lookup status) - Checkout page holds { address, errors } and passes them
// down, so the same values can be bundled straight into the order object.
const AddressForm = ({ address, errors, onChange }) => {
  const addressRef = useRef(address);
  const [pincodeStatus, setPincodeStatus] = useState(null); // null | "loading" | "success" | "not-found" | "error"

  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  // The moment a valid 6-digit pincode is entered, auto-fill State + City
  // from India Post's free public lookup API.
  useEffect(() => {
    const pin = address.pincode;

    if (!/^\d{6}$/.test(pin)) {
      setPincodeStatus(null);
      return;
    }

    let cancelled = false;
    setPincodeStatus("loading");

    fetch(`https://api.postalpincode.in/pincode/${pin}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const result = data?.[0];
        const postOffice = result?.Status === "Success" ? result.PostOffice?.[0] : null;

        if (!postOffice) {
          setPincodeStatus("not-found");
          return;
        }

        const matchedState = matchStateName(postOffice.State);
        const cityName = postOffice.District || postOffice.Name;

        onChange({
          ...addressRef.current,
          pincode: pin,
          state: matchedState,
          city: cityName,
        });
        setPincodeStatus("success");
      })
      .catch(() => {
        if (!cancelled) setPincodeStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.pincode]);

  const handleChange = (e) => {
    onChange({ ...address, [e.target.name]: e.target.value });
  };

  const handlePincodeChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange({ ...address, pincode: digitsOnly });
  };

  const handleStateChange = (e) => {
    // Changing state manually clears city, since the city list differs per state.
    onChange({ ...address, state: e.target.value, city: "" });
  };

  // Cities for the currently selected state, plus the current city value
  // itself (e.g. one filled in automatically by pincode lookup) even if
  // it isn't one of our pre-listed major cities - so it stays selectable.
  const cityOptions = (() => {
    const base = CITIES_BY_STATE[address.state] || [];
    if (address.city && !base.includes(address.city)) {
      return [address.city, ...base];
    }
    return base;
  })();

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

        <div>
          <Input
            label="Pincode"
            name="pincode"
            value={address.pincode}
            onChange={handlePincodeChange}
            error={errors.pincode}
            placeholder="6-digit pincode"
            required
          />
          {pincodeStatus === "loading" && (
            <p className="mt-1 text-xs text-gray-400">Looking up city &amp; state...</p>
          )}
          {pincodeStatus === "success" && (
            <p className="mt-1 text-xs text-green-600">City &amp; state auto-filled ✓</p>
          )}
          {pincodeStatus === "not-found" && (
            <p className="mt-1 text-xs text-amber-500">
              Pincode not found - please select city &amp; state manually.
            </p>
          )}
          {pincodeStatus === "error" && (
            <p className="mt-1 text-xs text-amber-500">
              Could not auto-fill - please select city &amp; state manually.
            </p>
          )}
        </div>

        <div className="hidden sm:block" />

        <Select
          label="State"
          name="state"
          value={address.state}
          onChange={handleStateChange}
          error={errors.state}
          required
        >
          <option value="">Select State</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>

        <Select
          label="City"
          name="city"
          value={address.city}
          onChange={handleChange}
          error={errors.city}
          required
          disabled={!address.state}
        >
          <option value="">{address.state ? "Select City" : "Select State first"}</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default AddressForm;