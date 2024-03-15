import mongoose, { Document, Model, Schema } from "mongoose";

interface PlaylistDocument extends Document {
    title: string;
    description: string;
    owner: Schema.Types.ObjectId;
    videos: Schema.Types.ObjectId[];
}

const playlistSchema = new Schema<PlaylistDocument>(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
    },
    { timestamps: true }
);

const Playlist: Model<PlaylistDocument> =
    mongoose.models.Playlist || mongoose.model<PlaylistDocument>("Playlist", playlistSchema);

export default Playlist;
