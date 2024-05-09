import express from "express";
import { CreatePost, DeletePost, UpdatePost, getAllPost, getPost } from "../Controller/Post.js";
import authtoken from "../middleware/Auth.js";
import { postValidator } from "../Utils/Validator.js";
const router = express.Router();

//======Create Post====//
router.post("/create", authtoken, postValidator, CreatePost)
router.put("/update/:slug", authtoken, UpdatePost)
router.delete("/delete/:slug", authtoken, DeletePost)
router.get("/list", authtoken, getAllPost)
router.get("/single/:slug", authtoken, getPost)

export default router