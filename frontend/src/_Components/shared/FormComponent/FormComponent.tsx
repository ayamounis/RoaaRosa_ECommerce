import { Input } from "@/_Components/ui/input";

export default function FormComponent() {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-text2 ">First Name</label>
            <Input name="name" className="input-Form" />
        </div>
    )
}
