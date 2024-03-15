"Use server";

import connectDB from "@/db/connectdb/connetdb";
import User from "@/db/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { TOKEN } from "@/constants/constants";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        connectDB();
        console.log("User registering....");

        const res = await request.json();
        const { email, password } = res;
        console.log(email, password);
        if ([email, password].some((field) => field?.trim === "")) {
            return {
                status: 400,
                message: "Email and password are required",
            };
        }
        console.log("Email and password are ok");

        const user = await User.findOne({ email: email });
        if (!user) {
            return {
                status: 400,
                message: "User not found",
            };
        }
        console.log("Email and password are ok");

        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            return {
                status: 400,
                message: "Invalid password",
            };
        }
        console.log("User registering....");

        const sessionToken = async () => {
            return jwt.sign(
                {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                },
                TOKEN.secret,
                {
                    expiresIn: TOKEN.expiresIn,
                }
            );
        };

        user.sessionToken = await sessionToken();
        await user.save();

        cookies().set({
            name: "sessionToken",
            value: await sessionToken(),
            httpOnly: true,
            secure: true,
        });

        return NextResponse.json({
            status: 200,
            message: "Login Successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
