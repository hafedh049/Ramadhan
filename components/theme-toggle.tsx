"use client"

import { Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // No toggle functionality since we're always in dark mode
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Moon className="h-5 w-5" />
      <span className="sr-only">Dark mode</span>
    </Button>
  )
}

