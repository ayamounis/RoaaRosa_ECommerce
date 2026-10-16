'use client'
import PasswordInput from "@/_Components/shared/PasswordInput/PasswordInput";
import { Button } from "@/_Components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UpdatePassword } from "./updatePassword.action";
import { schemaUpdatePassword } from "./updatePassword.schema";
import { UpdatePasswordType } from "./updatePassword.types";
import { signOut } from "next-auth/react";


export default function ProfilePasswordForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            currentPassword: "",
            password: "",
            rePassword: "",
        },
        mode: 'onChange',
        resolver: zodResolver(schemaUpdatePassword),
    })

    const onSubmit = async (data: UpdatePasswordType) => {
        const res = await UpdatePassword(data)
        if (res.message === 'success') {
            await signOut({callbackUrl:'/login'})
            toast.success('Password updated successfully')
            toast.success('Please login with your new password')
        }
        else {
            toast.error(res.errors.msg)
        }
    }



    return (
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="currentPassword" className="text-text2 ">Current Password</label>
                        <PasswordInput  {...register('currentPassword')} className="input-Form" />
                        {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="password" className="text-text2 ">New Password</label>
                        <PasswordInput placeholder="New Password" {...register('password')} className="input-Form" />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-end w-full">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="rePassword" className="text-text2 ">Confirm New Password</label>
                        <PasswordInput placeholder="Confirm Password" {...register('rePassword')} className="input-Form" />
                        {errors.rePassword && <p className="text-red-500 text-sm">{errors.rePassword.message}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row w-full gap-2">
                        <Button type="submit" className="button-primary rounded-md px-12 ">Save Changes</Button>
                        <Button type="button"
                            onClick={() => { reset() }}
                            className="text-text-2 hover:bg-secondary duration-200 rounded-md px-12">
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
