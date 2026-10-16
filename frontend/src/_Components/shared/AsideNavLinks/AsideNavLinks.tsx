'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

type AsideNavLinksProps = {
    title: string,
    titleIcon: React.ReactNode
    links: {
        title: string,
        href: string
        icon: React.ReactNode
    }[]
}
export default function AsideNavLinks({ title, links, titleIcon }: AsideNavLinksProps) {
    const pathName = usePathname();
    return (
        <div className="flex flex-col gap-4  bg-secondary sm:bg-Bg p-4 rounded-md w-fit">
            <h3 className="text-text2 font-medium hidden sm:block">{title}</h3>
            <h3 className="text-text2 font-medium block sm:hidden">{titleIcon}</h3>
            <nav className="flex flex-col gap-4 sm:ms-9">
                {links.map(({ title, href, icon }) => (
                    <div key={href} className="flex items-center gap-3">
                        <Link href={href} className={`flex gap-2 ${pathName == href ? 'text-secondary2 font-medium' : 'text-text2'}`}>
                            <span>{icon}</span>
                            <p className={`hidden sm:block navbarLink gap-3 w-fit `}>{title}</p>
                        </Link>
                    </div>
                ))}
            </nav>
        </div>
    )
}
