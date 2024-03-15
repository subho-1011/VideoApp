"use client";

import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidatePath } from "next/cache";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Card } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import { Dot, Edit2Icon } from "lucide-react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
// import axios from "axios";

const formSchema = z.object({
    avatar: z.any(),
});

type Avatar = {
    url: string | null;
    publicId: string | null;
};

export function AvatarCard({ avatar, coverImage }: { avatar: Avatar; coverImage: any }) {
    const [localAvatar, setLocalAvatar] = useState<Avatar>(avatar);
    const [newAvatarFile, setNewAvatarFile] = useState<File>();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            avatar: null,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (newAvatarFile) {
            const formData = new FormData();

            formData.append("avatar", newAvatarFile);
            console.log(formData.get("avatar"));

            const response = await axios.put("/api/auth/me/avatar", formData);
            console.log(response.data);
            revalidatePath("/");
        } else {
            toast({
                status: "error",
                title: "Error",
                description: "Please select an image",
            });
        }
    };

    useEffect(() => {
        if (avatar?.url) {
            setLocalAvatar(avatar);
        }
    }, [avatar]);

    return (
        <div className="flex flex-col w-fit min-w-60 py-20 gap-4">
            <AlertDialog>
                <AlertDialogTrigger>
                    <UserAvatar avatarUrl={localAvatar?.url} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update Avatar</AlertDialogTitle>
                    </AlertDialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {/* <FormLabel>Change your avatar</FormLabel> */}
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex">
                                                <div className="flex py-2 px-4 border w-fit">
                                                    <Label
                                                        htmlFor="avatarInput"
                                                        className="cursor-pointer hover:text-sky-500 hover:underline"
                                                    >
                                                        Choose new Image
                                                        <Input
                                                            type="file"
                                                            id="avatarInput"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                field.onChange(e.target.files);
                                                                setNewAvatarFile(e.target.files?.[0]);
                                                            }}
                                                            ref={field.ref}
                                                        />
                                                    </Label>
                                                </div>
                                                {newAvatarFile && (
                                                    <div className="flex py-2 mx-4">{newAvatarFile.name}</div>
                                                )}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {newAvatarFile && (
                                <div className="md:max-w-56 mt-4">
                                    <Image
                                        src={URL.createObjectURL(newAvatarFile)}
                                        alt="avatar"
                                        width={400}
                                        height={400}
                                        className="flex w-60 h-60 rounded-full object-fill"
                                    />
                                </div>
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction type="submit">Save</AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex justify-center">@Subscribe</div>
        </div>
    );
}

export function UserAvatar({ avatarUrl }: { avatarUrl: string | null }) {
    return (
        <div className="w-56 h-56 flex cursor-pointer">
            <Avatar className="w-full h-full">
                <AvatarImage src={avatarUrl!} alt="avatar" />
                <AvatarFallback>SP</AvatarFallback>
            </Avatar>
        </div>
    );
}

export function ProfileCoverImage({}) {
    const [coverImage, setCoverImage] = useState();

    // const onDeleteCoverImage = async () => {
    //     await axios({
    //         method: "DELETE",
    //         url: "/api/auth/me/cover-image",
    //     });
    // };

    const getCoverImage = async () => {
        const response = await axios({
            method: "GET",
            url: "/api/auth/me",
        });

        console.log(response.data);
        setCoverImage(response.data.data.coverImage);
        console.log(coverImage);
    };

    useEffect(() => {
        getCoverImage();
    }, []);

    return (
        <Card>
            <div className="h-[30vh] flex relative">
                <AspectRatio ratio={16 / 3}>
                    <Image
                        src={coverImage?.url || ""}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        className="flex justify-center"
                    />
                    <div className="absolute top-0 right-0 p-2">
                        <>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button
                                        onClick={getCoverImage}
                                        className="flex w-12 justify-center items-center m-1"
                                    >
                                        <Edit2Icon />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <UpdateCoverImage />
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    </div>
                </AspectRatio>
            </div>
        </Card>
    );
}

// ----------------------------------------------------------------

const coverImgFormSchema = z.object({
    coverImage: z.any(),
});

type CoverImage = {
    url: string | null;
    publicId: string | null;
};

export function UpdateCoverImage() {
    const [localCoverImg, setLocalCoverImg] = useState<CoverImage>();
    const [newCoverImgFile, setNewCoverImgFile] = useState<File>();

    const form = useForm<z.infer<typeof coverImgFormSchema>>({
        resolver: zodResolver(coverImgFormSchema),
        defaultValues: {
            coverImage: null,
        },
    });

    const onSubmit = async (data: z.infer<typeof coverImgFormSchema>) => {
        if (newCoverImgFile) {
            const formData = new FormData();

            formData.append("coverImage", newCoverImgFile);
            console.log(formData.get("coverImage"));

            const response = await axios.put("/api/auth/me/cover-image", formData);
            console.log(response.data);
            revalidatePath("/me");
        } else {
            toast({
                status: "error",
                title: "Error",
                description: "Please select an image",
            });
        }
    };

    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Update CoverImage</AlertDialogTitle>
            </AlertDialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* <FormLabel>Change your coverImage</FormLabel> */}
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex">
                                        <div className="flex py-2 px-4 border w-fit">
                                            <Label
                                                htmlFor="coverImageInput"
                                                className="cursor-pointer hover:text-sky-500 hover:underline"
                                            >
                                                Choose new Image
                                                <Input
                                                    type="file"
                                                    id="coverImageInput"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files);
                                                        setNewCoverImgFile(e.target.files?.[0]);
                                                    }}
                                                    ref={field.ref}
                                                />
                                            </Label>
                                        </div>
                                        {newCoverImgFile && (
                                            <div className="flex py-2 mx-4">{newCoverImgFile.name}</div>
                                        )}
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {newCoverImgFile && (
                        <div className="  mt-4">
                            <Card>
                                <div className="h-[250px] flex">
                                    <AspectRatio ratio={16 / 3}>
                                        <Image
                                            src={URL.createObjectURL(newCoverImgFile)}
                                            alt="coverImage"
                                            width={400}
                                            height={400}
                                            className="flex h-[250px] object-cover"
                                        />
                                    </AspectRatio>
                                </div>
                            </Card>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Save</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </Form>
        </>
    );
}
