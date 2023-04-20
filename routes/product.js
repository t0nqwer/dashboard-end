import express from "express";
import {
  addCloth,
  addImport,
  addKhwanta,
  addSupplier,
  getAddCloth,
  getAddImport,
  getAddKhwanta,
  productList,
  getSingleCloth,
  getSingleProduct,
  deleteDetailPhoto,
  updateDetailPhoto,
  deletePhoto,
} from "../controller/product.js";
import { requireAuth } from "../middleware/Authverify.js";

const router = express.Router();
router.use(requireAuth);

router.post("/addSupplier", addSupplier);
router.post("/addKhwanta", addKhwanta);
router.post("/addImport", addImport);
router.post("/addCloth", addCloth);
router.get("/productList", productList);
router.get("/getAddCloth", getAddCloth);
router.get("/getAddKhwanta", getAddKhwanta);
router.get("/getAddImport", getAddImport);
router.get("/getSingleCloth/:id", getSingleCloth);
router.get("/getSingleProduct/:id", getSingleProduct);
router.post("/deleteDetailPhoto", deleteDetailPhoto);
router.post("/updateDetail", updateDetailPhoto);
router.post("/deletePhoto", deletePhoto);

export default router;
