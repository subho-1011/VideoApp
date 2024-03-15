import Sider from "@/components/navigation/Sider";

export default function ContentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-1 h-full overflow-hidden">
            <div className="flex-shrink w-fit border-r">{/* <Sider /> */}</div>
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
