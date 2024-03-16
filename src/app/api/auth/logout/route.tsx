import connectDB from "@/db/connectdb/connetdb";
import User from "@/db/models/user";
import { verifyJwtToken } from "@/lib/verify-jwt-token";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
    connectDB();

    try {
        const token = cookies().get("sessionToken");
        if (!token) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized: No token provided",
            });
        }

        const decodeToken = verifyJwtToken();
        if (!decodeToken) {
            return NextResponse.json({
                status: 200,
                message: "You are not authorized",
            });
        }

        await User.findByIdAndUpdate(
            decodeToken._id,
            {
                $unset: {
                    sessionToken: 1,
                },
            },
            { new: true }
        );

        cookies().delete("sessionToken");

        return NextResponse.json({
            status: 200,
            message: "Successfully logout",
        });
    } catch (error: any) {
        console.log(error.message);
    }
}
