"use server";

import { CLOUDINARY } from "@/constants/constants";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: CLOUDINARY.cloudName,
    api_key: CLOUDINARY.apiKey,
    api_secret: CLOUDINARY.apiSecret,
});

export async function POST(request: Request) {
    const body = await request.json();
    const { paramsToSign } = body;

    // paramsToSign.api_key = CLOUDINARY.apiKey;

    const signature = cloudinary.utils.api_sign_request(paramsToSign, CLOUDINARY.apiKey);

    return Response.json({ signature });
}
