import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.js";
import designRoutes from "./routes/design.js";
import productRoutes from "./routes/product.js";
import fabricRoutes from "./routes/fabric.js";
import webRoutes from "./routes/web.js";
import stockRoutes from "./routes/stock.js";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/* Routes */
app.use("/socket.io", (req, res) => res.send("socket.io"));
app.use("/design", designRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/fabric", fabricRoutes);
app.use("/web", webRoutes);
app.use("/stock", stockRoutes);
const port = parseInt(process.env.PORT) || 7070;
const server = createServer(app);

const io = new Server({
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // credentials: true,
  },
});
io.attach(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(port, () => {
  console.log(`helloworld: listening on http://localhost:${port}`);
});
