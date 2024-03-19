"use client";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/store/features/user-slice";
import axios from "axios";
import { Heart, HistoryIcon, Home, LogOutIcon, MenuIcon, Podcast, Tv2Icon, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavElement = {
    id: number;
    name: string;
    path: string;
    icons: React.ReactNode;
};

const navElement: NavElement[] = [
    {
        id: 1,
        name: "Home",
        path: "/",
        icons: <Home />,
    },
    {
        id: 2,
        name: "Profile",
        path: "/me",
        icons: <User />,
    },
    { id: 3, name: "WatchHistory", path: "/watch-history", icons: <HistoryIcon /> },
    {
        id: 4,
        name: "Subscriptions",
        path: "/subscriptions",
        icons: <Users />,
    },
    {
        id: 5,
        name: "Playlists",
        path: "/playlists",
        icons: <Tv2Icon />,
    },
    {
        id: 6,
        name: "Liked Videos",
        path: "/liked-videos",
        icons: <Heart />,
    },
    {
        id: 7,
        name: "Community Posts",
        path: "/community-posts",
        icons: <Podcast />,
    },
];

export default function Sider() {
    const [open, setOpen] = React.useState<boolean>(false);
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    const onLogout = async () => {
        await axios.delete("/api/auth/logout");
        dispatch(logoutUser());

        toast({
            title: "Logged out successfully",
        });
    };

    return (
        <div className="flex w-full h-full mt-4">
            <div
                className="fixed z-50 top-6 left-8 hover:cursor-pointer hover:scale-105 transition delay-200"
                onClick={() => setOpen(!open)}
            >
                <MenuIcon size={30} />
            </div>
            <div className="flex w-full flex-col px-4">
                {navElement.map((item) => (
                    <div key={item.id}>
                        <Link href={item.path} className="flex w-full">
                            <div
                                className={cn(
                                    "flex w-full items-center mx-2 px-4 py-3 my-1.5 text font-medium rounded-2xl transition-transform delay-150 hover:scale-105 dark:hover:bg-slate-800 dark:hover:ring-2 dark:hover:ring-slate-400",
                                    {
                                        "rounded-lg": !open,
                                        "scale-105 bg-slate-800 ring-2 ring-slate-400": pathname === item.path,
                                    }
                                )}
                            >
                                <span className="">{item?.icons}</span>
                                <div
                                    className={cn("hidden w-0", {
                                        "flex grow w-full pl-4": !open,
                                    })}
                                >
                                    <div className="">{item.name}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
                <div className="flex w-full" onClick={onLogout}>
                    <div
                        className={cn(
                            "flex w-full items-center mx-2 px-4 py-4 my-2 text font-medium rounded-2xl transition-transform delay-150 hover:scale-105 dark:hover:bg-slate-800 dark:hover:ring-2 dark:hover:ring-slate-400",
                            {
                                "rounded-lg": !open,
                            }
                        )}
                    >
                        <span className="">
                            <LogOutIcon />
                        </span>
                        <div
                            className={cn("hidden w-0", {
                                "flex grow w-full pl-4": !open,
                            })}
                        >
                            Log Out
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
