export const dynamic = "force-dynamic";

import ProfilePasswordForm from "./UpdatePassword.form";

export default function changePassword() {
    return (
        <div className="p-10  shadow-shadow">
            <h2 className="text-secondary2 font-medium text-xl">Change Profile Password</h2>
            <ProfilePasswordForm />
        </div>
    )
}
