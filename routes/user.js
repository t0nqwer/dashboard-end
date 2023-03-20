import express from "express";
import { LogInUser, LogoutUser, SignUpUser } from "../controller/user.js";

const router = express.Router();

router.post("/login", LogInUser);
router.post("/Signup", SignUpUser);
router.post("/logout", LogoutUser);

export default router;
