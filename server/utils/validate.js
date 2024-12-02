// Check if the input is an email
export const isEmail = (auth) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(auth);
};

// Check if the input is a phone number
// Check if the input is a phone number
export const isPhoneNumber = (auth) => {
  let phone = auth.trim();

  // Check if the number has 11 digits and no country code
  if (/^\d{11}$/.test(phone)) {
    // Add +88 for Bangladeshi phone numbers
    phone = `+88${phone}`;
  }

  // Check if the number starts with 88 and is followed by 11 digits (without +)
  else if (/^88\d{11}$/.test(phone)) {
    // Add + before the number
    phone = `+${phone}`;
  }

  // Validate the final phone format
  const phoneRegex = /^\+88\d{11}$/; // Bangladeshi phone numbers should match this pattern

  // Return the formatted phone number if valid, else return false
  return phoneRegex.test(phone) ? phone : false;
};
