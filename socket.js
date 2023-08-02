import { io } from "socket.io-client";
// http://localhost:7080
// "http://167.172.69.153/"
export const socketconnect = io("http://localhost:7080", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "kVdeNbeYcdcHPXGt",
  },
  query: {
    "my-key": "my-value",
  },
});
