"use server";

import { NextRequest, NextResponse } from "next/server";
import User from "@/db/models/user";
import connectDB from "@/db/connectdb/connetdb";
import { verifyJwtToken } from "@/lib/verify-jwt-token";

export async function PUT(request: NextRequest) {
    console.log("PUT", request + " " + JSON.stringify(request));
    try {
        connectDB();
        console.log("User updating ....");

        const decodeToken = verifyJwtToken({ token: "sessionToken" });
        if (!decodeToken) {
            return NextResponse.json({
                status: 200,
                message: "You are not authorized",
            });
        }

        const user = await User.findById(decodeToken?._id).select("-password -sessionToken");
        if (!user) {
            return NextResponse.json({
                status: 400,
                message: "User not found",
            });
        }

        const res = await request.json();
        const { email, fullname } = res;
        if (email && fullname) {
            user.email = email;
            user.fullname = fullname;
            await user.save();
        }

        const updatedUser = await User.findById(user._id).select("-password -sessionToken");

        return NextResponse.json({
            status: 200,
            data: updatedUser,
            message: "User updated successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
