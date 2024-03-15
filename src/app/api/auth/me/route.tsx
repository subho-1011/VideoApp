"use server";

import { NextResponse } from "next/server";
import User from "@/db/models/user";
import connectDB from "@/db/connectdb/connetdb";
import { verifyJwtToken } from "@/lib/verify-jwt-token";


export async function GET() {
    try {
        connectDB();

        const decodeToken = verifyJwtToken({ token: "sessionToken" });
        if (!decodeToken) {
            return NextResponse.json({
                status: 200,
                message: "You are not authorized",
            });
        }

        const user = await User.findById(decodeToken._id).select("-password -sessionToken");
        if (user) {
            return NextResponse.json({
                status: 200,
                data: user,
                message: "Get profile information",
            });
        }
    } catch (error) {
        console.log(error);
    }
}
