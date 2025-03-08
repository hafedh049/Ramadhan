"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Color =
  | "blue"
  | "green"
  | "purple"
  | "rose"
  | "amber"
  | "teal"
  | "indigo"
  | "cyan"
  | "red"
  | "orange"
  | "pink"
  | "emerald"
  | "violet"
  | "fuchsia"
  | "lime"
  | "yellow"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultColor?: Color
}

type ThemeProviderState = {
  color: Color
  setColor: (color: Color) => void
}

const colorVariables: Record<Color, { primary: string; ring: string }> = {
  blue: {
    primary: "221.2 83.2% 53.3%",
    ring: "221.2 83.2% 53.3%",
  },
  green: {
    primary: "142.1 76.2% 36.3%",
    ring: "142.1 76.2% 36.3%",
  },
  purple: {
    primary: "262.1 83.3% 57.8%",
    ring: "262.1 83.3% 57.8%",
  },
  rose: {
    primary: "346.8 77.2% 49.8%",
    ring: "346.8 77.2% 49.8%",
  },
  amber: {
    primary: "37.7 96.1% 48.2%",
    ring: "37.7 96.1% 48.2%",
  },
  teal: {
    primary: "172.1 66.5% 50.4%",
    ring: "172.1 66.5% 50.4%",
  },
  indigo: {
    primary: "243.4 75.4% 58.6%",
    ring: "243.4 75.4% 58.6%",
  },
  cyan: {
    primary: "192.9 100% 50.4%",
    ring: "192.9 100% 50.4%",
  },
  red: {
    primary: "0 84.2% 60.2%",
    ring: "0 84.2% 60.2%",
  },
  orange: {
    primary: "24.6 95% 53.1%",
    ring: "24.6 95% 53.1%",
  },
  pink: {
    primary: "330.7 81.9% 60.2%",
    ring: "330.7 81.9% 60.2%",
  },
  emerald: {
    primary: "160 84% 39%",
    ring: "160 84% 39%",
  },
  violet: {
    primary: "270 76% 53%",
    ring: "270 76% 53%",
  },
  fuchsia: {
    primary: "289.1 100% 50%",
    ring: "289.1 100% 50%",
  },
  lime: {
    primary: "85.5 93% 35%",
    ring: "85.5 93% 35%",
  },
  yellow: {
    primary: "47.9 95.8% 53.1%",
    ring: "47.9 95.8% 53.1%",
  },
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children, defaultColor = "blue" }: ThemeProviderProps) {
  const [color, setColor] = useState<Color>(defaultColor)

  useEffect(() => {
    // Always set dark mode
    document.documentElement.classList.add("dark")

    const savedColor = localStorage.getItem("color") as Color | null

    if (savedColor && colorVariables[savedColor]) {
      setColor(savedColor)
      updateColorVariables(savedColor)
    } else {
      updateColorVariables(defaultColor)
    }
  }, [defaultColor])

  const updateColorVariables = (newColor: Color) => {
    const variables = colorVariables[newColor]
    if (!variables) return

    Object.entries(variables).forEach(([property, value]) => {
      document.documentElement.style.setProperty(`--${property}`, value)
    })
  }

  const handleSetColor = (newColor: Color) => {
    setColor(newColor)
    localStorage.setItem("color", newColor)
    updateColorVariables(newColor)
  }

  const value = {
    color,
    setColor: handleSetColor,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

