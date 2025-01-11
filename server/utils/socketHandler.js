import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const socketHandler = (io) => {
  // Store active drivers and users with their rideId and location
  let activeDrivers = {};
  let activeUsers = {};
  // Namespaces
  const driverNamespace = io.of("/driver");
  const userNamespace = io.of("/user");
  const adminNamespace = io.of("/admin");

  // User namespace
  userNamespace.on("connection", (socket) => {
    // Track active user
    socket.on("joinRide", async (data) => {
      socket.join(`ride-${data.id}`);
      activeUsers[socket.id] = { socketId: socket.id, ...data };
      // Notify admins of updated active users
      adminNamespace.emit(
        "activeUsers",
        Array.from(Object.values(activeUsers))
      );
      try {
        await prisma.user.update({
          where: {
            id: data.id,
          },
          data: {
            isOnline: true,
          },
        });
      } catch (error) {}
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
      const disconnectedUser = activeUsers[socket.id];

      delete activeUsers[socket.id]; // Remove user from active list on disconnect
      // Notify admins of updated active users
      adminNamespace.emit(
        "activeUsers",
        Array.from(Object.values(activeUsers))
      );
      if (disconnectedUser) {
        try {
          await prisma.user.update({
            where: {
              id: disconnectedUser.id,
            },
            data: {
              isOnline: false,
              lastOnlineTime: new Date(),
            },
          });
        } catch (error) {}
      }
    });
  });

  // Driver namespace
  //   driverNamespace.on("connection", (socket) => {
  //     console.log("Driver connected");

  //     // Track active user
  //     socket.on("joinRide", (rideId) => {
  //       socket.join(`ride-${rideId}`);
  //       activeDrivers[socket.id] = { rideId, socketId: socket.id };
  //     });

  //     // Handle user disconnection
  //     socket.on("disconnect", () => {
  //       delete activeUsers[socket.id]; // Remove user from active list on disconnect
  //       console.log("User disconnected");
  //     });
  //   });

  // Admin namespace
  adminNamespace.on("connection", (socket) => {
    // Emit all active drivers and users to the admin
    socket.emit("activeDrivers", Array.from(Object.values(activeDrivers)));
    socket.emit("activeUsers", Array.from(Object.values(activeUsers)));

    // Listen to ride join
    socket.on("joinRide", (data) => {
      socket.join(`ride-${data.id}`);
    });

    // Handle admin disconnection
    socket.on("disconnect", () => {
      console.log("Admin disconnected");
    });
  });
};

export default socketHandler;
