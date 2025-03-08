"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Languages, Bell, Volume2, Eye, Clock, Palette } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Settings interface
interface AppSettings {
  fontSize: number
  language: string
  translation: string
  notifications: boolean
  audioEnabled: boolean
  prayerReminders: boolean
  autoScroll: boolean
}

// Default settings
const defaultSettings: AppSettings = {
  fontSize: 16,
  language: "english",
  translation: "saheeh",
  notifications: true,
  audioEnabled: true,
  prayerReminders: true,
  autoScroll: false,
}

// Color variables for theme customization
const colorVariables = {
  red: { primary: "0, 84.2%, 60.2%" },
  orange: { primary: "24.6, 95%, 53.1%" },
  amber: { primary: "45, 100%, 50%" },
  yellow: { primary: "60, 100%, 50%" },
  lime: { primary: "90, 76%, 58%" },
  green: { primary: "120, 60%, 50%" },
  emerald: { primary: "150, 66%, 59%" },
  teal: { primary: "180, 53%, 52%" },
  cyan: { primary: "180, 100%, 50%" },
  sky: { primary: "204, 100%, 50%" },
  blue: { primary: "220, 100%, 65%" },
  indigo: { primary: "257, 47%, 60%" },
  violet: { primary: "270, 59%, 57%" },
  purple: { primary: "286, 61%, 64%" },
  fuchsia: { primary: "300, 76%, 55%" },
  pink: { primary: "330, 79%, 69%" },
  rose: { primary: "343, 100%, 65%" },
}

export default function SettingsPage() {
  const { theme, toggleTheme, color, setColor } = useTheme()
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("ramadhan-pro-settings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)

        // Apply font size to document
        document.documentElement.style.setProperty("--app-font-size", `${parsedSettings.fontSize}px`)
      } catch (error) {
        console.error("Error parsing settings:", error)
      }
    }
  }, [])

  // Update settings
  const updateSettings = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value }
      setHasChanges(true)
      return newSettings
    })

    // Apply font size immediately
    if (key === "fontSize") {
      document.documentElement.style.setProperty("--app-font-size", `${value}px`)
    }
  }

  // Save settings
  const saveSettings = () => {
    localStorage.setItem("ramadhan-pro-settings", JSON.stringify(settings))
    setHasChanges(false)

    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings)
    document.documentElement.style.setProperty("--app-font-size", `${defaultSettings.fontSize}px`)
    setHasChanges(true)

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your Ramadhan Pro experience</p>
      </motion.div>

      <div className="space-y-10">
        {/* Appearance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold border-b pb-2">Appearance</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Theme Color
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {Object.keys(colorVariables).map((colorOption) => (
                  <div key={colorOption} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => setColor(colorOption as any)}
                      className={`h-10 w-10 rounded-full transition-all ${
                        color === colorOption ? "ring-4 ring-primary ring-offset-2" : "hover:scale-110"
                      }`}
                      style={{
                        backgroundColor: `hsl(${colorVariables[colorOption as keyof typeof colorVariables].primary})`,
                      }}
                      aria-label={`Set color to ${colorOption}`}
                    />
                    <span className="text-xs capitalize">{colorOption}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Font Size
                </h3>
                <span className="text-muted-foreground">{settings.fontSize}px</span>
              </div>
              <Slider
                value={[settings.fontSize]}
                max={24}
                min={12}
                step={1}
                onValueChange={(value) => updateSettings("fontSize", value[0])}
                className="w-full"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Language & Translation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold border-b pb-2">Language & Translation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center">
                <Languages className="h-4 w-4 mr-2" />
                App Language
              </Label>
              <Select value={settings.language} onValueChange={(value) => updateSettings("language", value)}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="indonesian">Indonesian</SelectItem>
                  <SelectItem value="malay">Malay</SelectItem>
                  <SelectItem value="turkish">Turkish</SelectItem>
                  <SelectItem value="urdu">Urdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="translation" className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Quran Translation
              </Label>
              <Select value={settings.translation} onValueChange={(value) => updateSettings("translation", value)}>
                <SelectTrigger id="translation">
                  <SelectValue placeholder="Select translation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saheeh">Saheeh International</SelectItem>
                  <SelectItem value="pickthall">Muhammad Pickthall</SelectItem>
                  <SelectItem value="yusufali">Yusuf Ali</SelectItem>
                  <SelectItem value="hilali">Hilali & Khan</SelectItem>
                  <SelectItem value="indonesian">Indonesian Ministry of Religion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.section>

        {/* Notifications & Audio */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold border-b pb-2">Notifications & Audio</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications for prayer times and app updates</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Audio Recitation
                </Label>
                <p className="text-sm text-muted-foreground">Enable audio recitation for Quran verses</p>
              </div>
              <Switch
                checked={settings.audioEnabled}
                onCheckedChange={(checked) => updateSettings("audioEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Prayer Time Reminders
                </Label>
                <p className="text-sm text-muted-foreground">Receive reminders before prayer times</p>
              </div>
              <Switch
                checked={settings.prayerReminders}
                onCheckedChange={(checked) => updateSettings("prayerReminders", checked)}
              />
            </div>
          </div>
        </motion.section>

        {/* Reading Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold border-b pb-2">Reading Preferences</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Scroll</Label>
                <p className="text-sm text-muted-foreground">Automatically scroll through verses during recitation</p>
              </div>
              <Switch
                checked={settings.autoScroll}
                onCheckedChange={(checked) => updateSettings("autoScroll", checked)}
              />
            </div>
          </div>
        </motion.section>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings} disabled={!hasChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

