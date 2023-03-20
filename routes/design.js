import express from "express";
import {
  AddNewDesign,
  DelDesign,
  GetDataForImport,
  GetDesignList,
  getSingledesign,
} from "../controller/design.js";
import { requireAuth } from "../middleware/Authverify.js";
const router = express.Router();
router.use(requireAuth);

router.get("/GetAddDesign", GetDataForImport);
router.post("/AddDesign", AddNewDesign);
router.get("/Designlist", GetDesignList);
router.get("/deletedesign/:id", DelDesign);
router.get("/singledesign/:id", getSingledesign);

export default router;
