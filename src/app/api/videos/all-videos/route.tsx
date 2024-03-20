"use server";

import connectDB from "@/db/connectdb/connetdb";
import Video from "@/db/models/video";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    connectDB();

    try {
        const videos = await Video.aggregate([
            {
                $match: {
                    isPublished: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                username: 1,
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    owner: {
                        $arrayElemAt: ["$owner", 0],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    slug: 1,
                    thumbnail: 1,
                    duration: 1,
                    owner: 1,
                    views: 1,
                    isPublished: 1,
                },
            },
        ]);

        if (videos.length > 0) {
            return NextResponse.json({
                status: 200,
                data: videos,
                message: "Videos fetched successfully",
            });
        } else {
            return NextResponse.json({
                status: 404,
                message: "No videos found",
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
