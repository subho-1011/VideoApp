"use client";

import React, { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarCard } from "./avatar-card";
import axios from "axios";
import { ProfileCoverImage } from "./cover-image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { profile_me } from "@/services/auth";
import { setUser } from "@/store/features/user-slice";
import { useRouter } from "next/navigation";

export default function Profile() {
    return (
        <main className="flex w-full flex-col items-center justify-between p-10">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-center">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProfileCoverImage />
                    <ProfileCard />
                </CardContent>
            </Card>
        </main>
    );
}

type Avatar = {
    url: string;
    publicId: string;
};

type UserData = {
    email: string;
    fullname: string;
    username: string;
    avatar?: Avatar;
};

export function ProfileCard() {
    const [isEditable, setIsEditable] = React.useState<boolean>(false);
    const userData = useAppSelector((state) => state.User.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    console.log(userData);

    useEffect(() => {
        const getUserData = async () => {
            const res = await profile_me();
            console.log(res.data);
            let userData = res?.data;
            if (!userData) {
                router.push("/login");
            } else {
                dispatch(setUser(userData));
            }
        };

        if (!userData) {
            getUserData();
        }
    }, [router, dispatch, userData]);
    console.log(userData);

    const onEditable = () => {
        setIsEditable(!isEditable);
    };

    return (
        <Card>
            <CardContent className="lg:flex justify-between items-center gap-4 gap-x-10 mt-10 lg:mx-20 mx-10">
                <div className="flex lg:w-[40vh] justify-center">
                    <AvatarCard />
                </div>
                <div className="flex flex-col justify-center lg:w-[60vh] gap-8">
                    <div className="flex items-center">
                        <Label htmlFor="fullName" className="w-[25vh] text-md">
                            Full Name
                        </Label>
                        <Input value={userData?.fullname} readOnly={!isEditable} />
                    </div>
                    <div className="flex items-center">
                        <Label htmlFor="username" className="w-[25vh] text-md">
                            Username
                        </Label>
                        <Input value={userData?.username} readOnly={!isEditable} />
                    </div>
                    <div className="flex items-center">
                        <Label htmlFor="email" className="w-[25vh] text-md">
                            Email Address
                        </Label>
                        <Input value={userData?.email} readOnly={!isEditable} />
                    </div>
                    <div className="flex items-center justify-end">
                        {isEditable && (
                            <Button className="mr-8" onClick={onEditable}>
                                Cancel
                            </Button>
                        )}
                        <Button onClick={onEditable}>{isEditable ? "Save" : "Edit"}</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
