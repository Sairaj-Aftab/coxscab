import { connectDB } from "./db.js";

let updatedUsers = new Map(); // Use a Map for O(1) lookups

export async function setupChangeStream(io) {
  const { usersCollection } = await connectDB();

  const changeStream = usersCollection.watch([], {
    fullDocument: "updateLookup",
  });

  changeStream.on("change", (change) => {
    if (change.updateDescription?.updatedFields["location.coordinates"]) {
      if (change.fullDocument) {
        // Ensure `updatedAt` exists, otherwise use current time
        change.fullDocument.updatedAt = new Date().toISOString();

        // Store user in the Map with `_id` as key
        updatedUsers.set(
          change.fullDocument._id.toString(),
          change.fullDocument
        );

        // Emit only this updated user to reduce data load
        io.of("/admin").emit("userUpdated", change.fullDocument);
      }
    }
  });

  changeStream.on("error", (error) => {
    // console.error("Change Stream error:", error);
  });

  // Cleanup function running every 5 seconds
  setInterval(() => {
    const now = new Date();

    updatedUsers.forEach((user, key) => {
      if (
        !user.updatedAt ||
        now.getTime() - new Date(user.updatedAt).getTime() > 30 * 1000
      ) {
        updatedUsers.delete(key); // Remove expired users
      }
    });

    // console.log("updatedUsers", updatedUsers);

    // Emit only if there are updates
    if (updatedUsers.size > 0) {
      io.of("/admin").emit("allUsers", Array.from(updatedUsers.values()));
    }
  }, 5000); // Cleanup every 5 seconds
}
