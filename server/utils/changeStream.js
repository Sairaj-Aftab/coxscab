// streams.js
import { connectDB, usersCollection } from "./db.js";
// import { io } from "./socket.js"; // Your Socket.io instance

export async function setupLocationStream() {
  await connectDB();
  console.log("Connected to MongoDB");

  const pipeline = [
    {
      $match: {
        $and: [
          { operationType: "update" },
          {
            $or: [
              {
                "updateDescription.updatedFields.location.coordinates.0": {
                  $exists: true,
                },
              },
              {
                "updateDescription.updatedFields.location.coordinates.1": {
                  $exists: true,
                },
              },
              {
                "updateDescription.updatedFields.location.coordinates": {
                  $exists: true,
                },
              },
            ],
          },
        ],
      },
    },
  ];

  const changeStream = usersCollection.watch();
  //   console.log("Change Stream started", changeStream);

  changeStream.on("change", (change) => {
    // console.log("Change detected:", change);
    // console.log("Full Document:", change.fullDocument);
    const updatedFields = change.updateDescription?.updatedFields;

    // Check for updates in the entire location object or coordinates
    const coordinates =
      updatedFields?.["location.coordinates"] ||
      updatedFields?.location?.coordinates;

    if (coordinates) {
      console.log("Updated Fields:", coordinates);
    } else {
      console.log("No coordinate updates detected.");
    }

    // const userId = change.documentKey;
    // const coordinates =
    //   change.updateDescription.updatedFields["location.coordinates"];
    // console.log(userId);

    // Emit to all clients listening to this user's updates
    // io.emit(`location:update:${userId}`, {
    //   userId,
    //   coordinates: newLocation.coordinates,
    //   timestamp: new Date(),
    // });
  });

  changeStream.on("error", (error) => {
    console.error("Change Stream error:", error);
  });
}
