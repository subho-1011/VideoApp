"use client";
import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchIcon, VideoIcon } from "lucide-react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { LOGO } from "@/components/common/logo";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { logoutUser } from "@/store/features/user-slice";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Header() {
    const dispatch = useAppDispatch();
    const avatar = useAppSelector((state) => state.User.user?.avatar);
    const isLoggedIn = useAppSelector((state) => state.User.loggedIn);
    const router = useRouter();

    const onLogout = async () => {
        await axios.delete("/api/auth/logout");
        dispatch(logoutUser());

        toast({
            title: "Logged out successfully",
        });
    };

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
                    <Link href="videos/add-video">
                        <VideoIcon size={25} className="flex items-center" />
                    </Link>
                    <div className="flex px-4 rounded-full">
                        <ModeToggle />
                    </div>
                    <div className="flex items-center justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={avatar?.url || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className=" bg-transparent mt-3 mr-4 border rounded-lg">
                                {!isLoggedIn ? (
                                    <DropdownMenuItem>
                                        <div className="px-2 py-0.5">Login</div>
                                    </DropdownMenuItem>
                                ) : (
                                    <>
                                        <DropdownMenuItem>
                                            <div className="px-2 py-0.5" onClick={() => router.push("/me")}>
                                                Profile
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={onLogout}>
                                            <div className="px-2 py-0.5">Logout</div>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
