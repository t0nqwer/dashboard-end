import express from "express";
import {
  AddFabric,
  AddFabricPattern,
  getAddFabric,
} from "../controller/fabric.js";
import { requireAuth } from "../middleware/Authverify.js";

const router = express.Router();
router.use(requireAuth);

router.post("/AddFabricPattern", AddFabricPattern);
router.post("/AddFabric", AddFabric);
router.get("/GetAddFabric", getAddFabric);

export default router;
