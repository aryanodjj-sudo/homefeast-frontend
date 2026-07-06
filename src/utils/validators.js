import { VALIDATION_MESSAGES } from "./constants";

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email?.trim()) errors.email = VALIDATION_MESSAGES.REQUIRED;
  else if (!isValidEmail(email)) errors.email = VALIDATION_MESSAGES.INVALID_EMAIL;

  if (!password) errors.password = VALIDATION_MESSAGES.REQUIRED;
  else if (password.length < 6) errors.password = VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;

  return errors;
};

export const validateRegisterForm = ({ name, email, phone, password, confirmPassword }) => {
  const errors = {};

  if (!name?.trim()) errors.name = VALIDATION_MESSAGES.REQUIRED;
  else if (name.trim().length < 2) errors.name = VALIDATION_MESSAGES.INVALID_NAME;

  if (!email?.trim()) errors.email = VALIDATION_MESSAGES.REQUIRED;
  else if (!isValidEmail(email)) errors.email = VALIDATION_MESSAGES.INVALID_EMAIL;

  if (phone?.trim() && !isValidPhone(phone.trim())) {
    errors.phone = VALIDATION_MESSAGES.INVALID_PHONE;
  }

  if (!password) errors.password = VALIDATION_MESSAGES.REQUIRED;
  else if (password.length < 6) errors.password = VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;

  if (!confirmPassword) errors.confirmPassword = VALIDATION_MESSAGES.REQUIRED;
  else if (confirmPassword !== password) {
    errors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
  }

  return errors;
};

export const isValidPincode = (pincode) => /^\d{6}$/.test(pincode);

export const validateAddressForm = ({
  fullName,
  phone,
  addressLine1,
  city,
  state,
  pincode,
}) => {
  const errors = {};

  if (!fullName?.trim()) errors.fullName = VALIDATION_MESSAGES.REQUIRED;
  else if (fullName.trim().length < 2) errors.fullName = VALIDATION_MESSAGES.INVALID_NAME;

  if (!phone?.trim()) errors.phone = VALIDATION_MESSAGES.REQUIRED;
  else if (!isValidPhone(phone.trim())) errors.phone = VALIDATION_MESSAGES.INVALID_PHONE;

  if (!addressLine1?.trim()) errors.addressLine1 = VALIDATION_MESSAGES.REQUIRED;

  if (!city?.trim()) errors.city = VALIDATION_MESSAGES.REQUIRED;

  if (!state?.trim()) errors.state = VALIDATION_MESSAGES.REQUIRED;

  if (!pincode?.trim()) errors.pincode = VALIDATION_MESSAGES.REQUIRED;
  else if (!isValidPincode(pincode.trim())) errors.pincode = VALIDATION_MESSAGES.INVALID_PINCODE;

  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;

export const validateProfileForm = ({ name, phone }) => {
  const errors = {};

  if (!name?.trim()) errors.name = VALIDATION_MESSAGES.REQUIRED;
  else if (name.trim().length < 2) errors.name = VALIDATION_MESSAGES.INVALID_NAME;

  if (phone?.trim() && !isValidPhone(phone.trim())) {
    errors.phone = VALIDATION_MESSAGES.INVALID_PHONE;
  }

  return errors;
};