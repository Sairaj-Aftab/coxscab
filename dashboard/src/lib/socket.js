// utils/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_DOMAIN, {
  withCredentials: true,
});

export default socket;
