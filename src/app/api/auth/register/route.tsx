"use server";

import connectDB from "@/db/connectdb/connetdb";
import User from "@/db/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        connectDB();

        const res = await request.json();
        const { fullname, username, email, password } = res;
        if ([fullname, username, email, password].some((field) => field?.trim === "")) {
            return NextResponse.json({
                status: 404,
                message: "Please fill all the fields",
            });
        }

        const existUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (existUser) {
            return NextResponse.json({
                status: 400,
                message: "Username or email already exist",
            });
        }

        const registerUser = await User.create({
            fullname,
            username,
            email,
            password,
        });

        if (registerUser) {
            return NextResponse.json({
                status: 201,
                data: registerUser,
                message: "User registered successfully",
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
