"use server";

import connectDB from "@/db/connectdb/connetdb";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { uploadImageToCloudinary, uploadVideoToCloudinary } from "@/lib/cloudinary";
import Video from "@/db/models/video";
import { verifyJwtToken } from "@/lib/verify-jwt-token";
import User from "@/db/models/user";
import { DecodeToken } from "../../auth/me/avatar/route";

// add video
export async function POST(request: NextRequest) {
    try {
        connectDB();

        // get user
        const decodeToken = verifyJwtToken() as DecodeToken;
        const user = await User.findById(decodeToken._id);
        if (!user) {
            return NextResponse.json({
                status: 400,
                message: "User not found",
            });
        }

        const res = await request.formData();
        // get title, slug, description, thumbnail, video
        const title = res.get("title") as string;
        const slug = res.get("slug") as string;
        const description = res.get("description") as string;
        const thumbnail = res.get("thumbnail") as File;
        const video = res.get("video") as File;

        // upload thumbnail
        const thumbnailArrayBuffer = await thumbnail.arrayBuffer();
        const thumbnailBuffer = Buffer.from(thumbnailArrayBuffer);
        const thumbnailPath = `./public/upload/${thumbnail.name}`;
        writeFile(thumbnailPath, thumbnailBuffer);
        const thumbnailData = await uploadImageToCloudinary(thumbnailPath, "thumbnails");

        // upload video
        const videoArrayBuffer = await video.arrayBuffer();
        const videoBuffer = Buffer.from(videoArrayBuffer);
        const videoPath = `./public/upload/${video.name}`;
        writeFile(videoPath, videoBuffer);
        const videoData = await uploadVideoToCloudinary(videoPath, "videos");

        // create new video
        const newVideo = await Video.create({
            title,
            slug,
            description,
            thumbnail: {
                url: thumbnailData.url,
                publicId: thumbnailData.public_id,
            },
            videofile: {
                url: videoData.url,
                publicId: videoData.public_id,
            },
            duration: videoData.duration,
            owner: user._id,
            isPublished: true,
        });

        return NextResponse.json({
            status: 200,
            data: newVideo,
            message: "Video added successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
