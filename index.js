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
import employeeRoutes from "./routes/employee.js";
import { createServer } from "http";
import { socketconnect } from "./socket.js";
import {
  transferDesign,
  transferOtherProduct,
  transferProduct,
} from "./controller/transfer.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/design", designRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/fabric", fabricRoutes);
app.use("/web", webRoutes);
app.use("/stock", stockRoutes);
app.use("/employee", employeeRoutes);

app.get("/transferDesign", transferDesign);
app.get("/transferProduct", transferProduct);
app.get("/transferOtherProduct", transferOtherProduct);
const port = parseInt(process.env.PORT) || 8000;
const server = createServer(app);

server.listen(port, () => {
  console.log(`helloworld: listening on http://localhost:${port}`);
});
