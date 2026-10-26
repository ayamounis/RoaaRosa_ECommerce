'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

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
    const { isRtl } = useLanguage();

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm w-full space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2B2320] dark:text-[#FAF6F0] pb-3 border-b border-[#EBDED6] dark:border-[#3D332E] hidden sm:flex items-center gap-2">
                {titleIcon}
                <span>{title}</span>
            </h3>
            <div className="flex sm:hidden justify-center pb-2 border-b border-[#EBDED6] dark:border-[#3D332E] text-[#C48D80]">
                {titleIcon}
            </div>
            <nav className="flex flex-col gap-1.5">
                {links.map(({ title, href, icon }) => {
                    const isActive = pathName === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-[#FAF7F2] dark:bg-[#1F1917] text-[#C48D80] font-bold border border-[#EBDED6] dark:border-[#3D332E]'
                                    : 'text-[#988172] hover:text-[#2B2320] dark:hover:text-white hover:bg-[#FAF7F2]/60'
                            }`}
                        >
                            <span className="shrink-0">{icon}</span>
                            <span className="hidden sm:inline">{title}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    )
}
