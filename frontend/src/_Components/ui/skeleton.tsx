import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[#EBDED6]/70 dark:bg-[#38302C] animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
