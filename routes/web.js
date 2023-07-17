import express from "express";
import {
  ChangeDesignName,
  GetHero,
  GetProduct,
  GetProductforWeb,
  GetSingleProductforWeb,
  getQueryData,
  getdetailphoto,
  updateDetailPhotoWeb,
} from "../controller/website.js";
const router = express.Router();

router.get("/products", GetProductforWeb);
router.get("/Hero", GetHero);
router.get("/SingleProduct/:id", GetSingleProductforWeb);
router.post("/NewWeb", GetProduct);
router.post("/ChangeDesignName", ChangeDesignName);
router.post("/adddetailphoto", updateDetailPhotoWeb);
router.get("/getquerycode", getQueryData);
router.get("/getdetailphoto/:id", getdetailphoto);

export default router;
