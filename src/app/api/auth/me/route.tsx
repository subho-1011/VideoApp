// "use server";

import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/user";
import connectDB from "@/db/connectdb/connetdb";
import { verifyJwtToken } from "@/lib/verify-jwt-token";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        connectDB();

        const token = cookies().get("sessionToken");
        if (!token) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized: No token provided",
            });
        }
        console.log(token);

        const decodeToken = verifyJwtToken();
        if (!decodeToken) {
            return NextResponse.json({
                status: 200,
                message: "You are not authorized",
            });
        }
        console.log(decodeToken);

        const user = await User.findById(decodeToken._id).select("-password -sessionToken");
        if (user) {
            return NextResponse.json({
                status: 200,
                data: user,
                message: "Get profile information",
            });
        } else {
            return NextResponse.json({
                status: 404,
                message: "User not found",
            });
        }
    } catch (error) {
        console.log(error);
    }
}
