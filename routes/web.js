import express from "express";
import { GetProductforWeb } from "../controller/website.js";
const router = express.Router();

router.get("/products", GetProductforWeb);

export default router;
