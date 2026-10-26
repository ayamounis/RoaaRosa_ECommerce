export const dynamic = "force-dynamic";

import ProfileForm from "./Profile.form";

export default function ProfilePage() {
    return (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm">
            <ProfileForm />
        </div>
    );
}
