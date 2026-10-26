'use client';

import { LockKeyhole, MapPinHouse, MapPinned, Settings, User } from "lucide-react";
import AsideNavLinks from "../AsideNavLinks/AsideNavLinks";
import { useLanguage } from "@/context/LanguageContext";

export default function AsideNav() {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const accountLinks = [
        {
            title: isAr ? 'الملف الشخصي' : 'My Profile',
            href: '/profile',
            icon: <User className="w-4 h-4" />,
        },
        {
            title: isAr ? 'تغيير كلمة المرور' : 'Change Password',
            href: '/profile/change-password',
            icon: <LockKeyhole className="w-4 h-4" />,
        },
        {
            title: isAr ? 'إضافة عنوان جديد' : 'Add Address',
            href: '/profile/address-book',
            icon: <MapPinHouse className="w-4 h-4" />,
        },
        {
            title: isAr ? 'دفتر العناوين' : 'All Addresses',
            href: '/profile/address',
            icon: <MapPinned className="w-4 h-4" />,
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <AsideNavLinks
                titleIcon={<Settings className="w-4 h-4" />}
                title={isAr ? 'إدارة حسابي' : 'Manage My Account'}
                links={accountLinks}
            />
        </div>
    );
}
