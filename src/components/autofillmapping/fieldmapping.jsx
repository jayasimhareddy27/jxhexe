// fieldMapping.js

export const commonFieldMap = {
  // Personal
  firstname: "personal.firstName",
  lastname: "personal.lastName",
  email: "personal.email",
  phone: "personal.phoneNumber",
  mobile: "personal.phoneNumber",

  // Address
  city: "address.city",
  state: "address.state",
  zipcode: "address.zipCode",
  postcode: "address.zipCode",
  country: "address.country",

  // Career
  summary: "summary",
  aboutme: "summary",
  statement: "summary",

  // Socials
  linkedin: "profiles.linkedin",
  github: "profiles.github",
  portfolio: "profiles.portfolio"
};
/**
 * Helper to reach into nested objects using a string path (e.g., "personal.firstName")
 */
export const getNestedValue = (obj, path) => {
  if (!path) return null;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};