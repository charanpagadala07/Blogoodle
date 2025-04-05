import express from "express";
import { getme, login, logout, signup, } from "../controllers/auth.controller.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.post("/sign-up", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authorize, getme);


export default router;