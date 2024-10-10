export const timeAgo = (date) => {
  const timeUnits = [
    { unit: "year", inMilliseconds: 31536000000 },
    { unit: "month", inMilliseconds: 2592000000 },
    { unit: "day", inMilliseconds: 86400000 },
    { unit: "hour", inMilliseconds: 3600000 },
    { unit: "minute", inMilliseconds: 60000 },
    { unit: "second", inMilliseconds: 1000 },
  ];

  const currentDate = new Date();
  const inputDate = new Date(date);
  const timeDifference = currentDate - inputDate;

  for (let i = 0; i < timeUnits.length; i++) {
    const { unit, inMilliseconds } = timeUnits[i];
    const timeDifferenceInUnit = Math.floor(timeDifference / inMilliseconds);

    if (timeDifferenceInUnit >= 1) {
      return timeDifferenceInUnit === 1
        ? `${timeDifferenceInUnit} ${unit} ago`
        : `${timeDifferenceInUnit} ${unit}s ago`;
    }
  }

  return "Just now"; // If the date is in the future or something went wrong
};

// Example usage:
//   const pastDate = '2023-07-20T12:00:00'; // Can also pass a timestamp here
//   console.log(timeAgo(pastDate)); // Output: "5 days ago"

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0"); // Day (2 digits) in local time
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month (2 digits) in local time
  const year = date.getFullYear(); // Year in local time

  return `${day}-${month}-${year}`;
};

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

export const formatDateAndTime = (dateTimeString) => {
  const date = new Date(dateTimeString);

  const day = String(date.getDate()).padStart(2, "0"); // Day (2 digits)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month (2 digits)
  const hours = date.getHours(); // Local time hours
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutes (2 digits)

  // Format hours for 12-hour clock
  const formattedHours = hours % 12 || 12; // Convert 0 to 12
  const ampm = hours < 12 ? "AM" : "PM"; // Determine AM/PM

  return `${day}/${month} at ${formattedHours}:${minutes} ${ampm}`;
};
