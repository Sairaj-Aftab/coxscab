import { connectDB, usersCollection } from "./db.js";

let updatedUsers = new Map(); // Use a Map for O(1) lookups

export async function setupLocationStream(io) {
  await connectDB();

  const changeStream = usersCollection.watch([], {
    fullDocument: "updateLookup",
  });

  changeStream.on("change", (change) => {
    if (change.fullDocument) {
      const now = new Date();

      // Ensure `updatedAt` exists, otherwise use current time
      change.fullDocument.updatedAt =
        change.fullDocument.updatedAt || now.toISOString();

      // Store user in the Map with `_id` as key
      updatedUsers.set(change.fullDocument._id.toString(), change.fullDocument);

      // Emit only this updated user to reduce data load
      io.of("/admin").emit("userUpdated", change.fullDocument);
    }
  });

  changeStream.on("error", (error) => {
    console.error("Change Stream error:", error);
  });

  // Cleanup function running every 30 seconds
  setInterval(() => {
    const now = new Date();
    updatedUsers.forEach((user, key) => {
      if (!user.updatedAt || now - new Date(user.updatedAt) > 60 * 1000) {
        updatedUsers.delete(key); // Remove expired users
      }
    });

    // Emit only if there are updates
    io.of("/admin").emit("allUsers", Array.from(updatedUsers.values()));
  }, 30 * 1000); // Cleanup every 30 seconds
}
