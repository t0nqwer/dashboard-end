import express from "express";
import {
  GetHero,
  GetProduct,
  GetProductforWeb,
  GetSingleProductforWeb,
} from "../controller/website.js";
const router = express.Router();

router.get("/products", GetProductforWeb);
router.get("/Hero", GetHero);
router.get("/SingleProduct/:id", GetSingleProductforWeb);
router.post("/NewWeb", GetProduct);

export default router;
