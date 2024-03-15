import mongoose, { Document, Model, Schema } from "mongoose";

interface CommentDocument extends Document {
    text: string;
    owner: Schema.Types.ObjectId;
    video: Schema.Types.ObjectId;
    tweet: Schema.Types.ObjectId;
}

const commentSchema = new Schema<CommentDocument>(
    {
        text: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
        },
    },
    { timestamps: true }
);

const Comment: Model<CommentDocument> =
    mongoose.models.Comment || mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;
