import express from "express";
import { LogInUser, SignUpUser } from "../controller/user.js";

const router = express.Router();

router.post("/login", LogInUser);
router.post("/Signup", SignUpUser);

export default router;
