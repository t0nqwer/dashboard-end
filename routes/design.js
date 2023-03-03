import express from "express";
import { GetDataForImport } from "../controller/design.js";

const router = express.Router();

router.get("/GetAddDesign", GetDataForImport);

export default router;
