import { validationResult } from "express-validator";
import httpCode from "../Config/httpConstant.config.js";
import Post from "../Model/Post.js";
import Res from "../Services/general.hepler.js";
import { errorHandler } from "../Utils/ErrorrValidator.js";
import logger from "../Utils/pino.js";
import mongoose from "mongoose";
import Comment from "../Model/Comment.js";

//============comment Post================//
export const commentPost = async (req, res, next) => {
    try {
        const { text, parent } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(errorHandler(200, errors.array()));
        }
        const postId = req.params.postId

        // Post Exists
        const post_exists = await Post.findById(postId)

        if (!post_exists) {
            return next(errorHandler(httpCode.forbidden_code, "Post not found"))
        }

        // comment reply
        if (parent) {
            await Comment.create({ text, userId: req.user.id, parent })
            await Post.updateOne({ _id: postId }, { $inc: { "commentCount": 1 } })
            return Res(res, httpCode.success_code, "Comment successfully");
        }


        // new comment
        await Comment.create({ text, userId: req.user.id, postId, parent })
        await Post.updateOne({ _id: postId }, { $inc: { "commentCount": 1 } })

        return Res(res, httpCode.success_code, "Comment successfully");

    } catch (error) {
        logger.error(`Error at to comment.controller commentPost ${error}`)
        next(error)

    }
}

//============comment Update==================//
export const commentUpdate = async (req, res, next) => {
    try {
        const { text } = req.body;

        const commentId = req.params.commentId

        // comment Exists
        const comment_exists = await Comment.findById(commentId)

        if (!comment_exists) {
            return next(errorHandler(httpCode.forbidden_code, "Comment not found"))
        }

        if (comment_exists.userId.toString() !== req.user.id) {
            return next(errorHandler(httpCode.forbidden_code, "Permission denied"))
        }

        await Comment.findByIdAndUpdate(commentId, { text })
        return Res(res, httpCode.success_code, "Comment Updated successfully");

    } catch (error) {
        logger.error(`Error at to comment.controller commentUpdate ${error}`)
        next(error)
    }
}

//===============comment Deleted=================//
export const commentDeleted = async (req, res, next) => {
    try {

        const commentId = req.params.commentId

        // comment Exists
        const comment_exists = await Comment.findById(commentId)

        if (!comment_exists) {
            return Res(res, httpCode.forbidden_code, "Comment not found");
        }
        // Find the community
        console.log(comment_exists.postId)
        const post = await Post.findById(comment_exists.postId);
        if (!post) {
            return next(errorHandler(httpCode.forbidden_code, "Post not found"))

        }

        // Find Admin Id
        const product_admin = await Comment.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(commentId) }
            },
            {
                $graphLookup: {
                    from: 'comments', // Name of the collection
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parent',
                    as: 'nestedComments',
                    maxDepth: 10, // Adjust the depth based on your use case
                },
            },

            {
                $project: {
                    parentId: {
                        $map: {
                            input: '$nestedComments',
                            as: 'item',
                            in: { $toString: '$$item._id' }
                        }
                    }
                }
            }
        ])

        if (comment_exists.userId.toString() === req.user.id) {

            await Comment.findByIdAndDelete(commentId)

            const nestedDelete = await Comment.deleteMany({ _id: { $in: product_admin[0].parentId } })

            await Post.updateOne({ _id: comment_exists.postId }, { $inc: { "commentCount": -(nestedDelete.deletedCount + 1) } })

            return Res(res, httpCode.success_code, "Comment deleted successfully");
        }

        return next(errorHandler(httpCode.forbidden_code, "Permission denied"))


    } catch (error) {
        logger.error(`Error at to comment.controller commentDeleted ${error}`)
        next(error)
    }
}

//==============LIKE AND UNLIKE POST=================//
export const likePost = async (req, res, next) => {
    try {
        const postId = req.params.postId.trim();

        console.log(postId)
        const post = await Post.findById(postId);

        if (!post) {
            return next(errorHandler(httpCode.forbidden_code, "Post Not Found"))
        }
        if (post.likes.includes(req.user.id)) {
            const index = post.likes.indexOf(req.user.id);
            post.likes.splice(index, 1);

            await post.save();
            return Res(res, httpCode.success_code, "you unliked this post")
        } else {
            post.likes.push(req.user.id);
            await post.save();
            return Res(res, httpCode.success_code, "you liked this post")
        }
    } catch (error) {
        logger.error(`Error at to comment.controller likePost ${error}`)
        next(error)
    }
}