import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { SpaceBackground } from "@/components/space-background"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ramadhane - Islamic Companion",
  description: "A modern Islamic application with Quran, Dua, and Prayer Times features",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark" // Always add dark class
    >
      <head>
        <Script id="init-settings" strategy="beforeInteractive">
          {`
            // Initialize settings if they don't exist
            if (!localStorage.getItem('ramadhan-pro-settings')) {
              localStorage.setItem('ramadhan-pro-settings', JSON.stringify({
                fontSize: 16,
                language: "english",
                translation: "saheeh",
                notifications: true,
                audioEnabled: true,
                prayerReminders: true,
                autoScroll: false
              }));
            }
            
            // Apply font size from settings
            try {
              const settings = JSON.parse(localStorage.getItem('ramadhan-pro-settings') || '{}');
              if (settings.fontSize) {
                document.documentElement.style.setProperty('--app-font-size', \`\${settings.fontSize}px\`);
              }
            } catch (e) {
              console.error('Error applying settings:', e);
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>
          {/* Space background with pointer-events-none to not interfere with UI */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <SpaceBackground />
          </div>

          {/* Main layout container */}
          <div className="flex min-h-screen relative z-10">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-4 overflow-auto fancy-scrollbar">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'