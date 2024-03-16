import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Edit2Icon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { revalidatePath } from "next/cache";
import { toast } from "../ui/use-toast";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAppSelector } from "@/lib/hooks";
import { tempCoverImage } from "@/constants/constants";

export function ProfileCoverImage({}) {
    const coverImage = useAppSelector((state) => state.User.user?.coverImage);

    return (
        <Card>
            <div className="h-[30vh] flex relative">
                <AspectRatio ratio={16 / 3}>
                    <Image
                        src={coverImage?.url || tempCoverImage}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        className="flex justify-center"
                    />
                    <div className="absolute top-0 right-0 p-2">
                        <>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button className="flex w-12 justify-center items-center m-1">
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

export function UpdateCoverImage() {
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
