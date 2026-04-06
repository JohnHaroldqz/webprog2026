import { Schema, model, Document, Types } from "mongoose";

const commentSchema = new Schema({
    post_id: { 
        type: Schema.Types.ObjectId, 
        ref: "Post", 
        required: true  
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: "User", required: true 
    },
    user_name: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    comment_id: { type: Schema.Types.ObjectId, 
        ref: "Comment", 
        default: null 
    },
  },{ 
    timestamps: true 
}
);

export const Comment = model("Comment", commentSchema);
