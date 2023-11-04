import express from "express";
import { checkToken, login, register } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/checktoken",checkToken);

export default router;
