import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.js";
import designRoutes from "./routes/design.js";

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

app.use("/design", designRoutes);
app.use("/user", userRoutes);

const port = parseInt(process.env.PORT) || 7070;
app.listen(port, () => {
  console.log(`helloworld: listening on http://localhost:${port}`);
});
