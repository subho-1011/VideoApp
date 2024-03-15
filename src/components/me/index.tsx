"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Edit2Icon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AvatarCard, ProfileCoverImage } from "./avatar-card";
import axios from "axios";

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
    avatar: Avatar | null;
};

export function ProfileCard() {
    const [isEditable, setIsEditable] = React.useState<boolean>(false);
    const [userData, setUserData] = useState<UserData>({
        fullname: "",
        username: "",
        email: "",
        avatar: null,
    });

    useEffect(() => {
        async function getUserData() {
            const response = await axios({
                method: "GET",
                url: "/api/auth/me",
            });

            if (response.data.status === 200) {
                const data = response.data.data;
                userData.email = data.email;
                userData.fullname = data.fullname;
                userData.username = data.username;
                userData.avatar = data.avatar;
                setUserData(userData);
                console.log(userData);
            } else {
                console.log("Error: " + response.data);
            }
        }
        getUserData();
    }, [userData]);

    const onEditable = () => {
        setIsEditable(!isEditable);
    };

    return (
        <Card>
            <CardContent className="lg:flex justify-between items-center gap-4 gap-x-10 mt-10 lg:mx-20 mx-10">
                <div className="flex lg:w-[40vh] justify-center">
                    <AvatarCard avatar={userData.avatar} />
                </div>
                <div className="flex flex-col justify-center lg:w-[60vh] gap-8">
                    <div className="flex items-center">
                        <Label htmlFor="fullName" className="w-[25vh] text-md">
                            Full Name
                        </Label>
                        <Input value={userData.fullname} readOnly={!isEditable} />
                    </div>
                    <div className="flex items-center">
                        <Label htmlFor="username" className="w-[25vh] text-md">
                            Username
                        </Label>
                        <Input value={userData.username} readOnly={!isEditable} />
                    </div>
                    <div className="flex items-center">
                        <Label htmlFor="email" className="w-[25vh] text-md">
                            Email Address
                        </Label>
                        <Input value={userData.email} readOnly={!isEditable} />
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
