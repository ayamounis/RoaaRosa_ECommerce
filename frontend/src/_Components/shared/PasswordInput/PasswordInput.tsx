'use client'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/_Components/ui/input-group"
import { Eye, EyeClosed } from "lucide-react"
import { useState, forwardRef } from "react"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}


const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
    const [show, setshow] = useState(false)
    const isControlled = props.value !== undefined

    return (
        <InputGroup className={className} >
            <InputGroupInput
                ref={ref}
                {...props}
                type={show ? 'text' : 'password'}
                value={isControlled ? props.value : undefined}
                defaultValue={!isControlled ? props.defaultValue : undefined}
                placeholder={props.placeholder ?? "Password"}
            />
            <InputGroupAddon className="absolute end-0" align="inline-end">
                <InputGroupButton
                    aria-label="Password"
                    title="Password"
                    size="icon-xs"
                    onClick={() => {
                        setshow(!show)
                    }}>
                    {show ? <Eye /> : <EyeClosed />}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    )
})

PasswordInput.displayName = 'PasswordInput'
export default PasswordInput

