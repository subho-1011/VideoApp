"use server";

import connectDB from "@/db/connectdb/connetdb";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { deleteFileFromCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary";
import User from "@/db/models/user";
import { verifyJwtToken } from "@/lib/verify-jwt-token";

type DecodeToken = {
    _id: string;
    username: string;
    email: string;
};

export async function PUT(request: NextRequest) {
    connectDB();

    try {
        // check if the token is valid and user already authenticated
        const decodeToken = verifyJwtToken() as DecodeToken;
        const user = await User.findById(decodeToken);
        if (!user) {
            return NextResponse.json({
                status: 400,
                message: "User not found",
            });
        }

        // get the avatar from formdata
        const res = await request.formData();
        const coverImage = res.get("coverImage") as File;
        if (!coverImage) {
            return NextResponse.json({
                status: 400,
                message: "No avatar provided",
            });
        }

        // if old avatar is present in database then old avatar will be removed
        let oldCoverImage;
        if (user.coverImage) {
            oldCoverImage = user.coverImage;
        }

        // create buffer data of avatar
        const byteData = await coverImage.arrayBuffer();
        const buffer = Buffer.from(byteData);
        const path = `./public/upload/${coverImage.name}`;
        writeFile(path, buffer);

        // upload image to cloudinary
        const imageData = await uploadImageToCloudinary(path, "coverImage");

        // update avatar with image data from cloudinary
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    coverImage: {
                        url: imageData.url as string,
                        publicId: imageData.public_id as string,
                    },
                },
            },
            { new: true }
        );
        if (!updatedUser) {
            return NextResponse.json({
                status: 400,
                message: "Something went wrong updating the user",
            });
        }

        // all is good then delete old avatar from cloudinary
        if (oldCoverImage && oldCoverImage.url !== null) {
            await deleteFileFromCloudinary(oldCoverImage.publicId, "image");
        }

        return NextResponse.json({
            status: 200,
            data: updatedUser,
            message: "Avatar updated",
        });
    } catch (error) {
        console.log("An error occurred while updating the avatar");
    }
}
