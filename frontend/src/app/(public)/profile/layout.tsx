import AsideNav from "@/_Components/shared/AsideNav/AsideNav";

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen">
            <div className="container max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <aside className="lg:col-span-3">
                        <AsideNav />
                    </aside>
                    <main className="lg:col-span-9">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
