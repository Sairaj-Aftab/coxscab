import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const socketHandler = (io) => {
  // Store active drivers and users with their rideId and location
  let activeDrivers = {};
  let activeUsers = {};
  let activeOtherAdmins = {};
  // Namespaces
  const driverNamespace = io.of("/driver");
  const userNamespace = io.of("/user");
  const otherAdminNamespace = io.of("/other-admin");
  const adminNamespace = io.of("/admin");

  // User namespace
  userNamespace.on("connection", (socket) => {
    // Track active user
    socket.on("joinRide", async (data) => {
      socket.join(`ride-${data.id}`);
      activeUsers[socket.id] = { socketId: socket.id, ...data };
      // Notify admins of updated active users
      const allUsers = [
        ...Array.from(Object.values(activeDrivers)),
        ...Array.from(Object.values(activeUsers)),
        ...Array.from(Object.values(activeOtherAdmins)),
      ];
      adminNamespace.emit("allUsers", allUsers);
      try {
        await prisma.user.update({
          where: {
            id: data.id,
          },
          data: {
            isOnline: true,
            location: {
              type: "Point",
              coordinates: [data.longitude, data.latitude],
            },
          },
        });
      } catch (error) {}
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
      const disconnectedUser = activeUsers[socket.id];

      delete activeUsers[socket.id]; // Remove user from active list on disconnect
      // Notify admins of updated active users
      const allUsers = [
        ...Array.from(Object.values(activeDrivers)),
        ...Array.from(Object.values(activeUsers)),
        ...Array.from(Object.values(activeOtherAdmins)),
      ];
      adminNamespace.emit("allUsers", allUsers);
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
  driverNamespace.on("connection", (socket) => {
    console.log("Driver connected");

    // Track active user
    socket.on("joinRide", async (data) => {
      socket.join(`ride-${data.id}`);
      activeDrivers[socket.id] = { socketId: socket.id, ...data };
      // Notify admins of updated active users
      adminNamespace.emit(
        "activeDrivers",
        Array.from(Object.values(activeDrivers))
      );
      try {
        await prisma.user.update({
          where: {
            id: data.id,
          },
          data: {
            isOnline: true,
            location: {
              type: "Point",
              coordinates: [data.longitude, data.latitude],
            },
          },
        });
      } catch (error) {}
    });

    // Handle Driver user disconnection
    socket.on("disconnect", async () => {
      const disconnectedUser = activeDrivers[socket.id];

      delete activeDrivers[socket.id]; // Remove user from active list on disconnect
      // Notify admins of updated active users
      adminNamespace.emit(
        "activeDrivers",
        Array.from(Object.values(activeDrivers))
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
      console.log("Driver disconnected");
    });
  });
  // Other Admin like mobile admin user namespace
  otherAdminNamespace.on("connection", (socket) => {
    console.log("Other admin connected");
    // Track active user
    socket.on("joinRide", async (data) => {
      socket.join(`ride-${data.id}`);
      activeOtherAdmins[socket.id] = { socketId: socket.id, ...data };

      const allUsers = [
        ...Array.from(Object.values(activeDrivers)),
        ...Array.from(Object.values(activeUsers)),
        ...Array.from(Object.values(activeOtherAdmins)),
      ];
      adminNamespace.emit("allUsers", allUsers);
      // const interval = setInterval(async () => {
      //   try {
      //     console.log("Updating user status");

      //     await prisma.user.update({
      //       where: {
      //         id: data.id,
      //       },
      //       data: {
      //         isOnline: true,
      //         ...(data.location && {
      //           location: {
      //             type: "Point",
      //             coordinates: [
      //               data.location.longitude,
      //               data.location.latitude,
      //             ],
      //           },
      //         }),
      //       },
      //     });
      //   } catch (error) {
      //     console.error("Error updating user status:", error);
      //   }
      // }, 30000); // Emit every 1 second

      // return () => clearInterval(interval);
    });

    // Handle Other Admins user disconnection
    socket.on("disconnect", async () => {
      const disconnectedUser = activeOtherAdmins[socket.id];

      delete activeOtherAdmins[socket.id]; // Remove user from active list on disconnect
      // Notify admins of updated active users
      const allUsers = [
        ...Array.from(Object.values(activeDrivers)),
        ...Array.from(Object.values(activeUsers)),
        ...Array.from(Object.values(activeOtherAdmins)),
      ];
      adminNamespace.emit("allUsers", allUsers);
      if (disconnectedUser) {
        try {
          await prisma.user.update({
            where: {
              id: disconnectedUser.id,
            },
            data: {
              // isOnline: false,
              lastOnlineTime: new Date(),
            },
          });
        } catch (error) {
          console.error("Error updating user status:", error);
        }
      }
      console.log("Other Admin disconnected");
    });
  });

  // Admin namespace
  adminNamespace.on("connection", (socket) => {
    const allUsers = [
      ...Array.from(Object.values(activeDrivers)),
      ...Array.from(Object.values(activeUsers)),
      ...Array.from(Object.values(activeOtherAdmins)),
    ];
    socket.emit("allUsers", allUsers);
    // Emit all active drivers and users to the admin
    socket.emit("activeDrivers", Array.from(Object.values(activeDrivers)));
    socket.emit("activeUsers", Array.from(Object.values(activeUsers)));
    socket.emit(
      "activeOtherAdmins",
      Array.from(Object.values(activeOtherAdmins))
    );

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
