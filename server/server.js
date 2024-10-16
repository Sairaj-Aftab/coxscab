import express from "express";
import colors from "colors";
import cookieParser from "cookie-parser";
import env from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import authUser from "./routes/authUser.js";
import vehicleType from "./routes/vehicleType.js";
import vehicleCondition from "./routes/vehicleCondition.js";
import permission from "./routes/permission.js";
import role from "./routes/role.js";
import visitor from "./routes/visitorCount.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
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
    ],
    credentials: true,
  },
});

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
    ],
    credentials: true,
  })
);

app.use("/api/v1/auth", authUser);
app.use("/api/v1/vehicle-type", vehicleType);
app.use("/api/v1/vehicle-condition", vehicleCondition);
app.use("/api/v1/permission", permission);
app.use("/api/v1/role", role);
app.use("/api/v1/visitorcount", visitor);

// Error Handler
app.use(errorHandler);

// Socket Connection
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("socketio", io);

// App listen
server.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
