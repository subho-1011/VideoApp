import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LOGO } from "../common/logo";
import RegistrantionForm from "./registration-form";

export default function page() {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <Card className="max-w-xl w-96">
                <CardHeader>
                    <CardTitle>
                        <LOGO />
                    </CardTitle>
                    <div className="text-center">Sign Up</div>
                </CardHeader>
                <CardContent>
                    <RegistrantionForm />
                    <div className="text-center text-sm mt-8">
                        I already have an account{" "}
                        <Link href="/sign-in">
                            <span className="text-sky-500 underline">Log in</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
