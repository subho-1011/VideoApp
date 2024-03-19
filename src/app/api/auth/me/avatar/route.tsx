"use server";

import connectDB from "@/db/connectdb/connetdb";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { deleteFileFromCloudinary, uploadImageToCloudinary } from "@/lib/cloudinary";
import User from "@/db/models/user";
import { verifyJwtToken } from "@/lib/verify-jwt-token";

export type DecodeToken = {
    _id: string;
    username: string;
    email: string;
};

export async function PUT(request: NextRequest) {
    connectDB();

    try {
        // check if the token is valid and user already authenticated
        const decodeToken = verifyJwtToken() as DecodeToken;
        const user = await User.findById(decodeToken._id);
        if (!user) {
            return NextResponse.json({
                status: 400,
                message: "User not found",
            });
        }

        // get the avatar from formdata
        const res = await request.formData();
        const avatar = res.get("avatar") as File;
        if (!avatar) {
            return NextResponse.json({
                status: 400,
                message: "No avatar provided",
            });
        }

        // if old avatar is present in database then old avatar will be removed
        let oldAvatar;
        if (user.avatar) {
            oldAvatar = user.avatar;
        }

        // create buffer data of avatar
        const byteData = await avatar.arrayBuffer();
        const buffer = Buffer.from(byteData);
        const path = `./public/upload/${avatar.name}`;
        writeFile(path, buffer);

        // upload image to cloudinary
        const imageData = await uploadImageToCloudinary(path, "avatars");

        // update avatar with image data from cloudinary
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    avatar: {
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
        if (oldAvatar) {
            await deleteFileFromCloudinary(oldAvatar.publicId, "image");
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

/**
 * Upload image response from cloudinary server
 * {
    asset_id: '64ad2788c4cc74358ba884336a462338',
    public_id: 'avatars/asfaj9d3aj3etuimoccz',
    version: 1710493989,
    version_id: '24c3394e87b552dd0e550a5976c69478',
    signature: '41ee82b437b7d0b9776eb30c46bc2a3002f4d8d8',
    width: 5048,
    height: 3367,
    format: 'jpg',
    resource_type: 'image',
    created_at: '2024-03-15T09:13:09Z',
    tags: [],
    bytes: 2848204,
    type: 'upload',
    etag: '22086d2b5bb5d28c61788f1217fe7210',
    placeholder: false,
    url: 
      'http://res.cloudinary.com/dcufm6qr0/image/upload/v1710493989/avatars/asfaj9d3aj3etuimoccz.jpg',
    secure_url: 
      'https://res.cloudinary.com/dcufm6qr0/image/upload/v1710493989/avatars/asfaj9d3aj3etuimoccz.jpg',
    folder: 'avatars',
    original_filename: 'test (4)',
    api_key: '217823142964919'
  }
 */
