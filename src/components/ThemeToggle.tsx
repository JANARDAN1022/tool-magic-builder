
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isToggling, setIsToggling] = useState(false);

  const toggleTheme = () => {
    if (isToggling) return; // Prevent multiple clicks during transition
    
    setIsToggling(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Reset toggling state after a short delay
    setTimeout(() => {
      setIsToggling(false);
    }, 300); // Match transition time
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      disabled={isToggling}
      className="relative transition-colors"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
      }`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        theme === 'light' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
      }`} />
    </Button>
  );
}
