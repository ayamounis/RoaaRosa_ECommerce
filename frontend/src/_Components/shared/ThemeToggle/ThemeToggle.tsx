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
        <Button className="bg-primary text-gray-600  hover:bg-gray-200 hover:text-black dark:hover:bg-white dark:hover:text-black dark:text-yellow-400 dark:bg-black" variant={'ghost'} size='icon' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun /> : <Moon />}
            <span className="sr-only">Theme Toggle</span>
        </Button>
    )
}
