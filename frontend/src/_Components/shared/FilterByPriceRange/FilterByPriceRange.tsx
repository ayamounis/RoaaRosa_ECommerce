import { Slider } from "@/_Components/ui/slider";

export default function FilterByPriceRange({ value, setValue }: { value: number[], setValue: (value: number[]) => void }) {
    return (
        <div>
            <h3 className="!text-lg font-medium">Filter By Price</h3>
            <div className="w-full space-y-3 mt-2">
                <Slider
                    value={value}
                    onValueChange={setValue}
                    max={50000}
                    step={100}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Min: {value[0]}</span>
                    <span>Max: {value[1]}</span>
                </div>
            </div>
        </div>
    )
}
