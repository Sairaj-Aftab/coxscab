// db.js
import { MongoClient } from "mongodb";
import env from "dotenv";

env.config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

export const connectDB = async () => {
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  const usersCollection = db.collection("User"); // Match your Prisma model name

  return { db, usersCollection };
};
