export const dynamic = "force-dynamic";

import ProfileForm from "./Profile.form";

export default function profile() {
    return (
        <div className="p-10  shadow-shadow">
            <h2 className="text-secondary2 font-medium text-xl">Edit Your Profile</h2>
            <ProfileForm />
        </div>
    )
}
