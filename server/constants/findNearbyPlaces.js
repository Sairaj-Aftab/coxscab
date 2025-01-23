import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function findNearbyPlaces(longitude, latitude, radiusInKm) {
  const radiusInMeters = radiusInKm * 1000; // Convert kilometers to meters

  const nearbyPlaces = await prisma.place.findRaw({
    filter: {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude], // Longitude and Latitude
          },
          $maxDistance: radiusInMeters, // Radius in meters
        },
      },
      status: true, // Optional filter: Only active places
      trash: false, // Optional filter: Exclude trashed places
    },
    options: {
      projection: { address: 1, location: 1 }, // Optional: Specify fields to return
    },
  });

  return nearbyPlaces;
}

// Usage
findNearbyPlaces(90.4043, 23.8057, 5) // Example: longitude, latitude, radius in km
  .then((places) => console.log("Nearby Places:", places))
  .catch((error) => console.error("Error:", error));
