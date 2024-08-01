import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
// router.get("/getposts", getposts);
// router.delete("/deletepost/:postID/:userID", verifyToken, deletepost);
// router.put("/updatepost/:postID/:userID", verifyToken, updatepost);

export default router;
