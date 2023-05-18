import express from "express";
import {
  deleteStock,
  generateBarcode,
  getDataForStock,
} from "../controller/stock.js";

const router = express.Router();
router.get("/", generateBarcode);
router.get("/stockdata", getDataForStock);
router.get("/delete", deleteStock);
export default router;
