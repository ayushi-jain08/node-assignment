import express from "express";
import authtoken from "../middleware/Auth.js";
import { commentDeleted, commentPost, commentUpdate, likePost } from "../Controller/Comment.js";
import { commentValidator } from "../Utils/Validator.js";
const router = express.Router();

router.post("/create/:postId", authtoken, commentValidator, commentPost)
router.put("/update/:commentId", authtoken, commentUpdate)
router.delete("/delete/:commentId", authtoken, commentDeleted)
router.put("/post-like/:postId", authtoken, likePost)

export default router