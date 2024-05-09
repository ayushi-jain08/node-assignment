import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    image: {
        public_id: String,
        url: {
            type: String,
            required: true, // Move required property here
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    commentCount: { type: Number, default: 0 },
}, {
    timestamps: true,
})

const Post = mongoose.model("Post", postSchema)

export default Post;