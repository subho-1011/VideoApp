"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};

const addVideoSchema = z.object({
    title: z.string().trim(),
    slug: z.string().toLowerCase(),
    description: z.string().trim(),
    thumbnail: z.any(),
    video: z.any(),
    // tags: z.array(z.string()),
    isPublished: z.boolean(),
});

export default function AddVideoPage({}: Props) {
    const [thumbnail, setThumbnail] = useState<File>();
    const [video, setVideo] = useState<File>();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const addVideoForm = useForm<z.infer<typeof addVideoSchema>>({
        resolver: zodResolver(addVideoSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            thumbnail: undefined,
            video: undefined,
            // tags: [],
            isPublished: false,
        },
    });

    const onSubmit = async (data: z.infer<typeof addVideoSchema>) => {
        setIsUploading((prev) => !prev);

        if (!thumbnail) {
            setIsUploading((prev) => !prev);
            toast({
                variant: "destructive",
                title: "ERROR",
                description: "Please select a thumbnail",
            });
            return;
        }
        if (!video) {
            console.log("Please select a video");
            toast({
                variant: "destructive",
                title: "ERROR",
                description: "Please select a thumbnail",
            });
            setIsUploading(!isUploading);
            return;
        }

        data.thumbnail = thumbnail;
        data.video = video;

        const formData = new FormData();
        formData.set("title", data.title);
        formData.set("slug", data.slug);
        formData.set("description", data.description);
        formData.set("thumbnail", thumbnail);
        formData.set("video", video);

        const response = await axios.post("/api/videos/add-video", formData);

        console.log(response.data.message);
        if (response.data.status === 200) {
            toast({
                title: "Success",
                description: response.data.message,
                duration: 3000,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: response.data.message,
                duration: 10000,
            });
        }
        setIsUploading((prev) => !prev);
    };

    useEffect(() => {}, []);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-")
            .substring(0, 50);
    };

    const tagTransform = (inputTags: string) => {
        return inputTags.split(",").map((tag) => tag.trim());
    };

    return (
        <div className="w-full flex flex-col">
            <div>
                <CardHeader>
                    <CardTitle className="text-center">Add New Video</CardTitle>
                    <CardContent>
                        <Form {...addVideoForm}>
                            <form onSubmit={addVideoForm.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                                {/* title */}
                                <FormField
                                    control={addVideoForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="title"
                                                    {...field}
                                                    onChange={(e: any) => {
                                                        field.onChange(e);
                                                        const slug = generateSlug(e.target.value);
                                                        addVideoForm.setValue("slug", slug);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* slug */}
                                <FormField
                                    control={addVideoForm.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="slug" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* description */}
                                <FormField
                                    control={addVideoForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="description" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* tags */}
                                {/* <FormField
                                    control={addVideoForm.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="tags"
                                                    {...field}
                                                    onChange={(e) => tagTransform(e.target.value)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                /> */}
                                {/* thumbnail */}
                                <FormField
                                    control={addVideoForm.control}
                                    name="thumbnail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail</FormLabel>
                                            <FormControl>
                                                <>
                                                    <Input
                                                        type="file"
                                                        accept=".jpeg, .jpg, .png"
                                                        placeholder="Thumbnail"
                                                        {...field}
                                                        onChange={(e) => {
                                                            setThumbnail(e.target.files![0]);
                                                        }}
                                                    />
                                                </>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {thumbnail && (
                                    <>
                                        <div className="py-2 mx-4 h-[250px]">
                                            <Image
                                                src={URL.createObjectURL(thumbnail)}
                                                alt="thumbnail"
                                                width={400}
                                                height={400}
                                                loading="lazy"
                                                className="h-[250px] object-cover"
                                            />
                                        </div>
                                    </>
                                )}
                                {/* video */}
                                <FormField
                                    control={addVideoForm.control}
                                    name="video"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video</FormLabel>
                                            <FormControl>
                                                <>
                                                    <Input
                                                        type="file"
                                                        accept="video/*"
                                                        placeholder="video"
                                                        {...field}
                                                        onChange={(e) => {
                                                            setVideo(e.target.files![0]);
                                                        }}
                                                    />
                                                </>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* {video && (
                                    <>
                                        <div>
                                            <video>
                                                <source src={URL.createObjectURL(video)} type="video/mp4" />
                                            </video>
                                        </div>
                                    </>
                                )} */}

                                <div className="flex">
                                    {!isUploading ? (
                                        <>
                                            <Button type="submit">Submit</Button>
                                            <Button onClick={() => addVideoForm.reset()} className="mx-10">
                                                Reset
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button disabled>
                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Submit
                                            </Button>
                                            <Button disabled className="mx-10">
                                                Reset
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </CardHeader>
            </div>
        </div>
    );
}
