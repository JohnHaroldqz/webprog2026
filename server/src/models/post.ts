import { model, Schema } from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: String,
    published: Boolean,
    user_id: String,
    username: String,
}, {
    timestamps: true
})

const Post = model('Post', postSchema)

export default Post