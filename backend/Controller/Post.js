import { validationResult } from "express-validator";
import Post from "../Model/Post.js";
import User from "../Model/User.js";
import cloudinary from "../Utils/Cloudinary.js";
import { errorHandler } from "../Utils/ErrorrValidator.js";
import logger from "../Utils/pino.js";
import Res from "../Services/general.hepler.js";
import httpCode from "../Config/httpConstant.config.js";
import ShortUniqueId from "short-unique-id";
import mongoose from "mongoose";


//===============CREATE POST=================//
export const CreatePost = async (req, res, next) => {
    const { title } = req.body
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(errorHandler(200, errors.array()));
        }
        const file = req.files.photo;
        const folder = "images";
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder,
        });


        // Create new post
        const newPostData = {
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
            owner: req.user.id,
        };

        // If title exists, add it to newPostData and generate slug
        if (title) {
            const uid = new ShortUniqueId({ length: 5 });
            const slug = title.trim().replace(' ', '-') + "-" + uid.rnd()
            newPostData.title = title;
            newPostData.slug = slug;
        }

        const newPost = new Post(newPostData);
        await newPost.save();

        return Res(res, httpCode.success_code, "Post created successfully");
    } catch (error) {
        logger.error('Error in CreatePost :', error)
        next(error);
    }
};

//====================UPDATE POST===================//
export const UpdatePost = async (req, res, next) => {
    const { title } = req.body
    const { slug } = req.params
    try {
        // Check Post exist or not
        const is_post_exist = await Post.findOne({ slug })

        if (!is_post_exist) {
            return next(errorHandler(httpCode.forbidden_code, "Post Not Found"))
        }
        console.log("pp", req.user.id)
        console.log("oo", is_post_exist.owner)
        if (is_post_exist.owner.toString() !== req.user.id) {
            return next(errorHandler(httpCode.forbidden_code, "You have not permission to update this post"))
        }
        // Generate new slug if title is updated
        let newSlug = is_post_exist.slug;
        if (title && title !== is_post_exist.title) {
            const uid = new ShortUniqueId({ length: 5 });
            newSlug = title.trim().replace(' ', '-') + "-" + uid.rnd();
        }

        await Post.findOneAndUpdate({ slug }, { title, slug: newSlug })
        return Res(res, httpCode.success_code, "Post Updated successfully");
    } catch (error) {
        logger.error('Error in UpdatePost :', error)
        next(error);
    }
}

//=====================DELETE POST===================//
export const DeletePost = async (req, res, next) => {
    const { slug } = req.params
    try {
        // Check Post exist or not
        const is_post_exist = await Post.findOne({ slug })

        if (!is_post_exist) {
            return next(errorHandler(httpCode.forbidden_code, "Post Not Found"))
        }

        if (is_post_exist.owner.toString() !== req.user.id) {
            return next(errorHandler(httpCode.forbidden_code, "You have not permission to delete this post"))
        }
        await cloudinary.uploader.destroy(is_post_exist.image.public_id);
        // Delete Community
        await Post.findOneAndDelete({ slug })
        return Res(res, httpCode.success_code, "Post Deleted successfully");
    } catch (error) {
        logger.error('Error in DeletePost :', error)
        next(error);
    }
}

// get all Post
export const getAllPost = async (req, res) => {
    try {
        const { page, pageSize } = req.query
        const pageNum = parseInt(page) || 1
        const limit = parseInt(pageSize) || 15
        const skip = (pageNum - 1) * limit

        const userId = new mongoose.Types.ObjectId(req.user.id);

        const data = await Post.aggregate([
            { $skip: skip },
            { $limit: limit },
            { $match: { owner: userId } },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: { owner: 1, title: 1, slug: 1, image: 1, commentCount: 1, commentCount: 1, createdAt: 1, user_name: { $first: "$user.username" }, user_email: { $first: "$user.email" }, }
            }
        ])

        return Res(res, httpCode.success_code, "Data fetched successfully", data);
    } catch (error) {
        logger.error(`Error at to post.controller getAllPost ${error}`)
        return Res(res, httpCode.forbidden_code, "Internal Server Error");
    }
}

// get a single post details
export const getPost = async (req, res) => {
    try {
        const slug = req.params.slug
        if (!slug) {
            return Res(res, http.forbidden_code, "Slug is Required");
        }

        const { page, pageSize, view } = req.query

        const pageNum = parseInt(page) || 1
        const limit = parseInt(pageSize) || 3
        const skip = (pageNum - 1) * limit


        const viewMore = parseInt(view) || 1


        const data = await Post.aggregate([
            {
                $match: {
                    slug: slug
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "likes",
                    foreignField: "_id",
                    as: "likedUsers"
                }
            },

            {
                $project: {
                    owner: 1, title: 1, slug: 1, description: 1, image: 1, commentCount: 1, commentCount: 1, createdAt: 1, user_name: { $first: "$user.username" }, user_email: { $first: "$user.email" }, comments: {
                        $ifNull: ["$comments", []]
                    },
                    likedUsers: "$likedUsers.username"
                }
            }
        ])

        return Res(res, httpCode.success_code, "Data fetched successfully", data);
    } catch (error) {
        logger.error(`Error at to post.controller getPost ${error}`)
        return Res(res, httpCode.forbidden_code, "Internal Server Error");
    }
}
