import express from "express";
import { generateBarcode, getDataForStock } from "../controller/stock.js";

const router = express.Router();
router.get("/", generateBarcode);
router.get("/stockdata", getDataForStock);
export default router;
