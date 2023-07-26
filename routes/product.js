import express from "express";

import { requireAuth } from "../middleware/Authverify.js";
import {
  AddExampleProductCloth,
  AddExampleProductClothDetail,
  addCloth,
  addImport,
  addKhwanta,
  addSupplier,
  createBarcode,
  notifynewPriduct,
} from "../controller/product/add.js";
import {
  CheckDuplicateExample,
  getAddCloth,
  getAddExample,
  getAddImport,
  getAddKhwanta,
  getExampleList,
  getQueryData,
  getSingleCloth,
  getSingleExample,
  getSingleProduct,
  productClothList,
  productList,
} from "../controller/product/get.js";
import {
  deleteDetailPhoto,
  deleteExample,
  deletePhoto,
  deleteProduct,
} from "../controller/product/delete.js";
import {
  updateDetailPhoto,
  updatePriceCloth,
  updateWebStatus,
} from "../controller/product/update.js";

const router = express.Router();
router.use(requireAuth);

// get
router.get("/productList", productList);
router.get("/productClothList", productClothList);
router.get("/getquerydata", getQueryData);
router.get("/getAddCloth", getAddCloth);
router.get("/getAddKhwanta", getAddKhwanta);
router.get("/getAddImport", getAddImport);
router.get("/getSingleCloth/:id", getSingleCloth);
router.get("/getSingleProduct/:id", getSingleProduct);
router.get("/getaddexample", getAddExample);
router.get("/checkduplicatexample/:name", CheckDuplicateExample);
router.get("/exampleList", getExampleList);
router.get("/singleExample/:id", getSingleExample);
router.get("/deleteExample/:id", deleteExample);
router.get("/deleteProduct/:id", deleteProduct);
// post
router.post("/addSupplier", addSupplier);
router.post("/addKhwanta", addKhwanta);
router.post("/addImport", addImport);
router.post("/addCloth", addCloth, createBarcode, notifynewPriduct);
router.post("/deleteDetailPhoto", deleteDetailPhoto);
router.post("/updateDetail", updateDetailPhoto);
router.post("/deletePhoto", deletePhoto);
router.post("/changeWebStatus", updateWebStatus);
router.post("/ChangePriceCloth", updatePriceCloth);
router.post("/addexample", AddExampleProductCloth);
router.post("/addExampleImgDetail", AddExampleProductClothDetail);
export default router;
