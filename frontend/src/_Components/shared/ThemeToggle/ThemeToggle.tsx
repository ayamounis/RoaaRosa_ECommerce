'use client'
import { Button } from "@/_Components/ui/button";
import { useMounted } from "@/app/_hooks/useMounted";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const mounted = useMounted();
    if (!mounted) {
        return null; 
    }

    return (
        <Button
            className="w-7 h-7 p-1 rounded-full text-[#EBDED6] hover:text-white hover:bg-white/10 dark:hover:bg-white/10 bg-transparent transition-colors cursor-pointer"
            variant={'ghost'}
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle color theme"
        >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#E5C2AF]" /> : <Moon className="w-3.5 h-3.5 text-[#EBDED6]" />}
            <span className="sr-only">Theme Toggle</span>
        </Button>
    )
}
