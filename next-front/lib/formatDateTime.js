export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  // Reset the time part of the current date for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Format the time part in 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  const formattedTime = `${hours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  // Determine the relative day
  let dayPart;
  if (date.toDateString() === today.toDateString()) {
    dayPart = formattedTime; // Only show time if it's today
  } else if (date.toDateString() === yesterday.toDateString()) {
    dayPart = `Yesterday at ${formattedTime}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    dayPart = `Tomorrow at ${formattedTime}`;
  } else {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    dayPart = `${day}/${month} at ${formattedTime}`;
  }

  return dayPart;
};
