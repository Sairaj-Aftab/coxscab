import { MongoClient } from "mongodb";

// MongoDB connection and change stream
export default async function setupStream() {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db("coxscab");
  const collection = db.collection("User");

  // Watch for changes in the MongoDB collection
  const changeStream = collection.watch();

  changeStream.on("change", (change) => {
    // console.log("Change detected:", change);
    // Emit the change to all connected Socket.IO clients
    // io.emit("userChange", change);
  });
}
