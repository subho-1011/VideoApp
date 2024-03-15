"use client";

import React from "react";
import { login_me } from "@/services/auth";

import { useForm, SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LOGO } from "@/components/common/logo";
import SigninForm from "./login-form";
import Link from "next/link";

type LoginInputs = {
    email: string;
    password: string;
};

export default function Login() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginInputs>();

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        const loginUserData = await login_me(data);
        console.log(loginUserData);
    };

    return (
        <div className="flex h-full w-full justify-center items-center">
            <Card className="max-w-xl w-96">
                <CardHeader>
                    <CardTitle>
                        <LOGO />
                    </CardTitle>
                    <div className="text-center">Sign In</div>
                </CardHeader>
                <CardContent>
                    <SigninForm />
                    <div className="text-center text-sm mt-8">
                        I don`t have an account{" "}
                        <Link href="/sign-up">
                            <span className="text-sky-500 underline">Sign up</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
