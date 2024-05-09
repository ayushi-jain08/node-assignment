import mongoose from "mongoose"; 

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', 
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
},
    {
        timestamps: true,
    }
)

const Comment = mongoose.model('Comment', commentSchema)

export default Comment;
