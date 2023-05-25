import express from "express";
import {
  AddNewDesign,
  DelDesign,
  GetDataForImport,
  GetDesignList,
  getSingledesign,
  deleteDesignDetailImage,
  addDesignDetailImg,
  updateDesignData,
  updateDesignSize,
  addNewSize,
  notifynewsize,
} from "../controller/design.js";
import { requireAuth } from "../middleware/Authverify.js";
const router = express.Router();
router.use(requireAuth);

router.get("/GetAddDesign", GetDataForImport);
router.post("/AddDesign", AddNewDesign);
router.get("/Designlist", GetDesignList);
router.get("/deletedesign/:id", DelDesign);
router.get("/singledesign/:id", getSingledesign);
router.post("/deleteDetailImage", deleteDesignDetailImage);
router.post("/updateDetail", addDesignDetailImg);
router.post(
  "/updateDesign/:id",
  updateDesignData,
  updateDesignSize,
  addNewSize,
  notifynewsize
);

export default router;
