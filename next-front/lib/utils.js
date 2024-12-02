import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Bangladeshi phone number validation
export const isPhoneNumber = (value) => {
  let phone = value.trim();

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

export const getOtpExpiration = () => {
  const storedData = localStorage.getItem("phone");
  if (storedData) {
    const { expiresAt, phone } = JSON.parse(storedData);
    const currentTime = Date.now();
    const remainingTime = Math.max(
      0,
      Math.floor((expiresAt - currentTime) / 1000)
    );
    const removeExpiresAt = expiresAt + 5 * 60 * 1000;
    return { remainingTime, removeExpiresAt, phone };
  }
  return { remainingTime: 0, removeExpiresAt: 0, phone: null };
};

export const clearOtpExpiration = () => {
  localStorage.removeItem("phone");
};

export const formatMemberSince = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
};
