import mongoose, { Document, Model, Schema } from "mongoose";

interface LikeDocument extends Document {
    likeby: Schema.Types.ObjectId;
    video: Schema.Types.ObjectId;
    comment: Schema.Types.ObjectId;
    tweet: Schema.Types.ObjectId;
}

const likeSchema = new Schema<LikeDocument>(
    {
        likeby: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
        },
    },
    { timestamps: true }
);

const Like: Model<LikeDocument> = mongoose.models.Like || mongoose.model<LikeDocument>("Like", likeSchema);

export default Like;
