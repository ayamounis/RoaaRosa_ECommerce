import AsideNav from "@/_Components/shared/AsideNav/AsideNav";

export default function profileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid grid-cols-12 mt-10 min-h-100">
            <aside className="col-span-3">
                <AsideNav />
            </aside>
            <main className="col-span-9">
                {children}
            </main>
        </div>

    );
}
