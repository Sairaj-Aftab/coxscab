export const createSlug = (inputString) => {
  // Convert the input string to lowercase
  let slug = inputString.toLowerCase();

  // Replace spaces with dashes
  slug = slug.replace(/ /g, "-");

  // Remove special characters and keep only alphanumeric characters and dashes
  slug = slug.replace(/[^\w-]/g, "");

  // Remove multiple consecutive dashes
  slug = slug.replace(/--+/g, "-");

  // Remove leading and trailing dashes
  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
};

export const slugToMainText = (slug) => {
  // Replace dashes with spaces
  let mainText = slug.replace(/-/g, " ");

  // Capitalize the first letter of each word
  mainText = mainText.replace(/\b\w/g, (char) => char.toUpperCase());

  return mainText;
};
