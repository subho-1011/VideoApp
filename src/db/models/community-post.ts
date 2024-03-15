import mongoose, { Document, Model, Schema } from "mongoose";

interface CommunityPostDocument extends Document {
    text: string;
    owner: Schema.Types.ObjectId;
    image: {};
}

const communityPostSchema = new Schema<CommunityPostDocument>(
    {
        text: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            url: String,
            publicId: String,
        },
    },
    { timestamps: true }
);

const CommunityPost: Model<CommunityPostDocument> =
    mongoose.models.CommunityPost || mongoose.model<CommunityPostDocument>("Tweet", communityPostSchema);

export default CommunityPost;
