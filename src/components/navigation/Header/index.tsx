"use client";
import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchIcon, VideoIcon } from "lucide-react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { LOGO } from "@/components/common/logo";

export default function Header() {
    return (
        <header className="sticky my-3 top-10 z-10 border-b h-16 w-full flex justify-center items-center md:px-20 pr-8 pl-16 sm:pl-20">
            <div className="flex justify-between w-full max-w-7xl">
                <Link href="/home">
                    <LOGO />
                </Link>
                <div className="flex flex-shrink justify-end">
                    <div className="flex">
                        <Input
                            placeholder="Search..."
                            className="flex min-w-72 w-[60vh] pl-4 rounded-full rounded-r-none bg-transparent ring-2 ring-neutral-500"
                        />
                        <div className="flex justify-center items-center rounded-full rounded-l-none ml-1 px-4 ring-2 ring-neutral-500">
                            <SearchIcon />
                        </div>
                    </div>
                </div>
                <div className="flex h-10 w-fit items-center gap-4 rounded-full">
                    <Link href="videos/uploadVideo">
                        <VideoIcon size={25} className="flex items-center" />
                    </Link>
                    <div className="flex px-4 rounded-full">
                        <ModeToggle />
                    </div>
                    <Link href="#">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </div>
        </header>
    );
}
