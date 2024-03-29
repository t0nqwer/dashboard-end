import express from "express";
import {
  AddFabric,
  AddFabricPattern,
  AddFabricWeaving,
  getAddFabric,
  selectFabric,
  updateFabric,
  Getcurrent,
} from "../controller/fabric.js";
import { requireAuth } from "../middleware/Authverify.js";

const router = express.Router();
// router.use(requireAuth);

router.post("/AddFabricPattern", AddFabricPattern);
router.post("/AddFabricWeaving", AddFabricWeaving);
router.post("/AddFabric", AddFabric);
router.get("/GetAddFabric", getAddFabric);
router.get("/fabriclist", selectFabric);
router.post("/UpdateFabric", updateFabric);

router.get("/getcurrent", Getcurrent);

export default router;
