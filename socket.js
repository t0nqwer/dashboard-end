import { io } from "socket.io-client";
// http://localhost:7080
// "http://167.172.69.153/"
export const socketconnect = io(process.env.SOCKET_URL, {
  reconnectionDelayMax: 10000,
  auth: {
    token: "kVdeNbeYcdcHPXGt",
  },
  query: {
    "my-key": "my-value",
  },
});
``;
