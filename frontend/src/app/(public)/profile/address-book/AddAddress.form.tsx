'use client'
import { Button } from "@/_Components/ui/button";
import { Input } from "@/_Components/ui/input";
import { Textarea } from "@/_Components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AddAddress } from "./addAddress.action";
import { addAddressSchema } from "./addAddress.schema";
import { addAddress } from "./addAddress.types";


export default function AddAddressForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "",
            details: "",
            phone: "",
            city: "",
        },
        mode: 'onChange',
        resolver: zodResolver(addAddressSchema),
    })

    const onSubmit = async (data: addAddress) => {
        const res = await AddAddress(data)
        if (res.status === 'success') {
            reset()
            toast.success(res.message)
        }
        else {
            toast.error(res.message)
        }
    }

    return (
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="name" className="text-text2 ">Name</label>
                        <Input {...register("name")} placeholder="Work , office , Home " type="text" className="input-Form" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="phone" className="text-text2 ">Phone</label>
                        <Input {...register("phone")} placeholder="01234567890" type="text" className="input-Form" />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-6  w-full">
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="details" className="text-text2 ">Details</label>
                        <Textarea rows={4} cols={6} placeholder="Address Details ...." {...register("details")} className="input-Form resize-none max-w-100" />
                        {errors.details && <p className="text-red-500 text-sm">{errors.details.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 w-full ">
                        <label htmlFor="city" className="text-text2 ">City</label>
                        <Input {...register("city")} placeholder="Cairo" type="text" className="input-Form" />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end w-full gap-2">
                    <Button type="submit" className="button-primary rounded-md px-12 ">Add Address</Button>
                    <Button type="button"
                        onClick={() => { reset() }}
                        className="text-text-2 hover:bg-secondary duration-200 rounded-md px-12">Cancel
                    </Button>
                </div>
            </div>
        </form>
    )
}
