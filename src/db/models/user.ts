import mongoose, { Document, Model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN } from "@/constants/constants";

interface Image {
    url: string;
    publicId: string;
}

export interface UserDocument extends Document {
    username: string;
    fullname: string;
    email: string;
    avatar?: Image;
    coverImage?: Image;
    bio?: string;
    watchHistory?: [];
    password: string;
    isVarified: boolean;
    sessionToken?: string;
    sessionTokenExpiry?: boolean;
    resetToken?: string;
    resetTokenExpiry?: boolean;
}

const userSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        avatar: {
            url: String,
            publicId: String,
        },
        coverImage: {
            url: String,
            publicId: String,
        },
        bio: String,
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        password: {
            type: String,
            required: true,
        },
        isVarified: Boolean,
        sessionToken: String,
        sessionTokenExpiry: String,
        resetToken: String,
        resetTokenExpiry: Boolean,
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default User;
