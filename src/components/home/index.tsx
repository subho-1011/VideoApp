"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dot } from "lucide-react";
import axios from "axios";
import Link from "next/link";

type Video = {
    id: string;
    title: string;
    slug: string;
    thumbnail: {
        url: string;
        publicId: string;
    };
    owner: {
        username: string;
        avatar: {
            url: string;
            publicId: string;
        };
    };
    duration: number;
    views: number;
    isPublished: boolean;
};

export default function Home() {
    const [videos, setVideos] = useState<Video[]>([]);

    async function getAllVideos() {
        const res = await axios.get("/api/videos/all-videos");
        const data: Video[] = res.data.data;
        setVideos(data);
    }

    useEffect(() => {
        getAllVideos();
    }, []);

    useEffect(() => {
        if (videos.length > 0) {
            console.log(videos[0].title);
        }
    }, [videos]);

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}

function VideoCard({ video }: { video: Video }) {
    return (
        <div className="">
            <CardContent className="p-0 m-0">
                {/* thumbnail */}
                <Link href={`/videos/${video.slug}`} className="">
                    <Image
                        src={video.thumbnail.url}
                        className="h-60 w-full object-cover rounded"
                        alt=""
                        height={400}
                        width={400}
                        loading="lazy"
                    />
                </Link>
                {/* avatar, title, channel, views */}
                <div className="flex gap-x-4 items-center px-4 my-3">
                    <Avatar className="flex h-full items-start">
                        <AvatarImage src={video.owner.avatar.url} alt="avatar" className="" />
                        <AvatarFallback>SP</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-y-1">
                        <div className="font-semibold text-lg">
                            <Link href={`/videos/${video.slug}`} className="">
                                {video.title}
                            </Link>
                        </div>
                        <div className="flex justify-stretch gap-x-2">
                            <div className="text-gray-600 text-sm">
                                <Link href={`dashboard/${video.owner.username}`} className="">
                                    @{video.owner.username}
                                </Link>
                            </div>
                            <Dot />
                            <div className="text-gray-600 text-sm">
                                <div className="">{video.views} views</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </div>
    );
}
