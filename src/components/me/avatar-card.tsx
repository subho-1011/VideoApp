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
import { useAppSelector } from "@/lib/hooks";

const formSchema = z.object({
    avatar: z.any(),
});

type Avatar = {
    url: string | null;
    publicId: string | null;
};

export function AvatarCard() {
    const avatar = useAppSelector((state) => state.User.user?.avatar);
    console.log(avatar);
    const [localAvatar, setLocalAvatar] = useState<Avatar>();
    const [newAvatarFile, setNewAvatarFile] = useState<File>();

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
                title: "Error",
                description: "Please select an image",
            });
        }
    };

    return (
        <div className="flex flex-col w-fit min-w-60 py-20 gap-4">
            <AlertDialog>
                <AlertDialogTrigger>
                    <UserAvatar avatarUrl={avatar?.url} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update Avatar</AlertDialogTitle>
                    </AlertDialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
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

export function UserAvatar({ avatarUrl }: { avatarUrl: string | undefined }) {
    return (
        <div className="w-56 h-56 flex cursor-pointer">
            <Avatar className="w-full h-full">
                <AvatarImage src={avatarUrl} alt="avatar" />
                <AvatarFallback>SP</AvatarFallback>
            </Avatar>
        </div>
    );
}
