import mongoose, { Document, Model, Schema } from "mongoose";

interface VideoDocument extends Document {
    videofile: {
        url: string;
        publicId: string;
    };
    thumbnail: {
        url: string;
        publicId: string;
    };
    owner: Schema.Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    duration: number;
    tags?: string[];
    views: number;
    isPublished: boolean;
}

const videoSchema = new Schema<VideoDocument>(
    {
        videofile: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
        thumbnail: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        duration: {
            type: Number,
            required: true,
        },
        tags: {
            type: [String],
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Video: Model<VideoDocument> = mongoose.models.Video || mongoose.model<VideoDocument>("Video", videoSchema);

export default Video;
