import express from "express";
import {
  signup,
  signin,
  google,
  facebook,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/facebook", facebook);

export default router;
