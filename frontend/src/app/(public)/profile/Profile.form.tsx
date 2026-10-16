'use client'
import { Button } from "@/_Components/ui/button";
import { Input } from "@/_Components/ui/input";
import { setUserInfo } from "@/redux/slices/userInfo";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { UpdateProfileInfo } from "./profile.action";
import { schema } from "./profile.schema";
import { profileSchema } from "./profile.types";


export default function ProfileForm() {
    const { data: userData, update } = useSession() || {}
    const email = userData?.user?.email || ''
    const name = userData?.user?.name || ''

    const userInfo = useSelector((state: RootState) => state.userInfo)

    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm({
        defaultValues: {
            name: "",
            phone: userInfo.phone || "",
        },
        mode: 'onChange',
        resolver: zodResolver(schema),
    })
    const ResetForm = () => {
        reset({
            name,
            phone: userInfo.phone || "",
        })
        clearErrors()
    }

    const onSubmit = async (data: profileSchema) => {
        const res = await UpdateProfileInfo(data)
        if (res.message === 'success') {
            dispatch(setUserInfo(data))
            await update({ name: data.name })
            toast.success('Profile updated successfully')
        }
        else {
            toast.error('someThing went Wrong')
        }
    }

    useEffect(() => {
        reset({
            name: name,
            phone: userInfo.phone
        })
    }, [name, reset, userInfo.phone])



    return (
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="name" className="text-text2 ">Name</label>
                        <Input {...register("name")} type="text" className="input-Form" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="email-profile" className="text-text2 ">Email</label>
                        <Input type="email" value={email || ""} disabled className="input-Form" />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-end w-full">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="phone" className="text-text2 ">Phone</label>
                        <Input {...register("phone")} type="text" className="input-Form" />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row w-full gap-2">
                        <Button type="submit" className="button-primary rounded-md px-12 ">Save Changes</Button>
                        <Button type="button"
                                onClick={() => {ResetForm()}} 
                                className="text-text-2 hover:bg-secondary duration-200 rounded-md px-12">Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
