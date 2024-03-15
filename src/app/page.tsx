"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
    const { toast } = useToast();
    return (
        <div>
            <Button
                onClick={() => {
                    toast({
                        title: "Hello world!",
                    });
                }}
            >
                Click me
            </Button>
            <ModeToggle />
        </div>
    );
}
