"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
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
    tags: z.array(z.string()),
    isPublished: z.boolean(),
});

export default function AddVideoPage({}: Props) {
    const [thumbnail, setThumbnail] = useState<File>();
    const [video, setVideo] = useState<File>();

    const addVideoForm = useForm<z.infer<typeof addVideoSchema>>({
        resolver: zodResolver(addVideoSchema),
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            thumbnail: "",
            video: "",
            tags: [],
            isPublished: false,
        },
    });

    const onSubmit = async (data: z.infer<typeof addVideoSchema>) => {
        console.log(data);
    };

    useEffect(() => {}, []);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 -]/g, "") // Remove non-alphanumeric characters except space and hyphen
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
            .substring(0, 50); // Limit to 50 characters
    };

    return (
        <div className="w-full flex flex-col">
            <Card>
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
                                <FormField
                                    control={addVideoForm.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <Input placeholder="tags" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* thumbnail */}
                                <FormField
                                    control={addVideoForm.control}
                                    name="thumbnail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail</FormLabel>
                                            <FormControl>
                                                <div className="flex">
                                                    <Input
                                                        type="file"
                                                        accept=".jpeg, .jpg, .png"
                                                        placeholder={thumbnail?.name}
                                                        {...field}
                                                        onChange={(e) => {
                                                            setThumbnail(e.target.files![0]);
                                                        }}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {thumbnail && (
                                    <>
                                        <div className="py-2 mx-4">
                                            <Image
                                                src={URL.createObjectURL(thumbnail)}
                                                alt="thumbnail"
                                                width={400}
                                                height={400}
                                                loading="lazy"
                                            />
                                            <h1>{thumbnail.name}</h1>
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
                                                    {video && <div>{video.name}</div>}
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
                                    <Button type="submit">Submit</Button>
                                    <Button onClick={() => addVideoForm.reset()} className="mx-10">
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    );
}
