import express from "express";
import colors from "colors";
import cookieParser from "cookie-parser";
import env from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { PrismaClient } from "@prisma/client";
import authUser from "./routes/authUser.js";
import user from "./routes/user.js";
import review from "./routes/review.js";
import chart from "./routes/charts.js";
import driver from "./routes/driver/driver.js";
import driverStatus from "./routes/driver/driverStatus.js";
import driverActivities from "./routes/driver/driverActivities.js";
import vehicle from "./routes/vehicle/vehicle.js";
import vehicleType from "./routes/vehicle/vehicleType.js";
import vehicleCondition from "./routes/vehicle/vehicleCondition.js";
import garage from "./routes/garage.js";
import permission from "./routes/permission.js";
import role from "./routes/role.js";
import visitor from "./routes/visitorCount.js";
import packageItems from "./routes/package.js";
import errorHandler from "./middleware/errorHandler.js";
import setupStream from "./utils/databaseStream.js";

const prisma = new PrismaClient();

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.LOCAL_DOMAIN1,
      process.env.LOCAL_DOMAIN2,
      process.env.LOCAL_DOMAIN3,
      process.env.ADMIN_DOMAIN1,
      process.env.ADMIN_DOMAIN2,
      process.env.MAIN_DOMAIN1,
      process.env.MAIN_DOMAIN2,
      "http://192.168.160.166:8081",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
const server = createServer(app);
// dotenv config
env.config();
const PORT = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: [
      process.env.LOCAL_DOMAIN1,
      process.env.LOCAL_DOMAIN2,
      process.env.LOCAL_DOMAIN3,
      process.env.ADMIN_DOMAIN1,
      process.env.ADMIN_DOMAIN2,
      process.env.MAIN_DOMAIN1,
      process.env.MAIN_DOMAIN2,
      "http://192.168.160.166:8081",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

app.use("/api/v1/auth", authUser);
app.use("/api/v1/user", user);
app.use("/api/v1/review", review);
app.use("/api/v1/chart", chart);
app.use("/api/v1/driver", driver);
app.use("/api/v1/driver-status", driverStatus);
app.use("/api/v1/driver-activities", driverActivities);
app.use("/api/v1/vehicle", vehicle);
app.use("/api/v1/vehicle-type", vehicleType);
app.use("/api/v1/vehicle-condition", vehicleCondition);
app.use("/api/v1/garage", garage);
app.use("/api/v1/permission", permission);
app.use("/api/v1/role", role);
app.use("/api/v1/visitorcount", visitor);
app.use("/api/v1/package", packageItems);

// Error Handler
app.use(errorHandler);

// Socket Connection
let connectedUsers = new Map();
io.on("connection", (socket) => {
  // console.log("a user connected:", socket.id);

  socket.on("userActivity", async (data) => {
    if (data && typeof data === "object") {
      connectedUsers.set(socket.id, data);
      try {
        await prisma.user.update({
          where: { id: data.id },
          data: { isOnline: true },
        });
      } catch (error) {}
    }
    // Send to admin
    io.emit("activeUsers", Array.from(connectedUsers.values()));
  });

  socket.on("disconnect", async () => {
    const user = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id); // Remove the user from the Map
    if (user && user.id) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastOnlineTime: new Date(), isOnline: false },
        });
      } catch (error) {}
    }
    // Send to admin
    io.emit("activeUsers", Array.from(connectedUsers.values()));
  });
});

app.set("socketio", io);

setupStream();

// App listen
server.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
