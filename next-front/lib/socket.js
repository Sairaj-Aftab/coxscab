// utils/socket.js
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_DOMAIN, {
  withCredentials: true,
});

export default socket;
