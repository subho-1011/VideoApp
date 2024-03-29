"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store/store/store";
import Header from "@/components/navigation/Header";
import { Toaster } from "@/components/ui/toaster";
import Sider from "@/components/navigation/Sider";
import { initUser } from "@/store/features/user-slice";
import { profile_me } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>();

    const router = useRouter();

    useEffect(() => {
        const getUserData = async () => {
            const res = await profile_me();
            let userData = res?.data;
            if (!userData) {
                router.push("/login");
            } else {
                storeRef?.current?.dispatch(initUser(userData));
            }
        };

        getUserData();
    }, []);

    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }

    return (
        <Provider store={storeRef.current}>
            <div className="flex min-h-screen flex-col">
                <div className="flex-shrink-0">
                    <Header />{" "}
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-shrink w-fit border-r">
                        <Sider />
                    </div>
                    <main className="flex-1 overflow-y-auto px-6 py-4">{children}</main>
                </div>
                <Toaster />
            </div>
        </Provider>
    );
}
