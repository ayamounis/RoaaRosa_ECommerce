import { LockKeyhole, MapPinHouse, MapPinned, Settings, User } from "lucide-react";
import AsideNavLinks from "../AsideNavLinks/AsideNavLinks";

export const accountLinks = [
    {
        title: 'My Profile',
        href: '/profile',
        icon: <User />,
    },
    {
        title: 'Change Password',
        href: '/profile/change-password',
        icon: <LockKeyhole />

    },
    {
        title: 'Add Address',
        href: '/profile/address-book',
        icon: <MapPinHouse />
    },
    {
        title: 'All Addresses',
        href: '/profile/address',
        icon: <MapPinned />
    },
]
export default function AsideNav() {
    return (
        <div className="flex flex-col gap-6">
            <AsideNavLinks titleIcon={<Settings />} title={'Manage My Account'} links={accountLinks} />
        </div>
    )
}
