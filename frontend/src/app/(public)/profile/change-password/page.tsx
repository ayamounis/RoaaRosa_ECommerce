export const dynamic = "force-dynamic";

import ProfilePasswordForm from "./UpdatePassword.form";

export default function ChangePasswordPage() {
    return (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-sm">
            <ProfilePasswordForm />
        </div>
    );
}
