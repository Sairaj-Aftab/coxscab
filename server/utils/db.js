// db.js
import { MongoClient } from "mongodb";
import env from "dotenv";

env.config();

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

let db;
let usersCollection;

export async function connectDB() {
  await client.connect();
  db = client.db(process.env.DB_NAME);
  usersCollection = db.collection("User"); // Match your Prisma model name

  return { db, usersCollection };
}

export { db, usersCollection };
