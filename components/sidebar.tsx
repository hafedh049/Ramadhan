"use client"

import { useState } from "react"
import { Book, Home, FileText, Settings, HelpCircle, Bookmark, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RamadhaneLogo } from "@/components/ramadhane-logo"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Surah",
    href: "/surah",
    icon: Book,
  },
  {
    title: "Dua",
    href: "/dua",
    icon: FileText,
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
  },
]

const otherItems = [
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="bg-background/80 backdrop-blur-sm border shadow-sm"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen fixed left-0 top-0 z-40">
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="h-full border-r bg-background/80 backdrop-blur-sm p-4 flex flex-col fancy-scrollbar"
        >
          <SidebarContent pathname={pathname} />
        </motion.div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={toggleMobileMenu}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 left-0 h-screen w-3/4 max-w-xs bg-background/90 backdrop-blur-sm p-4 z-50 border-r shadow-lg fancy-scrollbar"
            >
              <SidebarContent pathname={pathname} onNavItemClick={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface SidebarContentProps {
  pathname: string
  onNavItemClick?: () => void
}

function SidebarContent({ pathname, onNavItemClick }: SidebarContentProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-8">
        <RamadhaneLogo />
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2">MAIN</h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <item.icon className="h-5 w-5" />
                </motion.div>
                <span>{item.title}</span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-primary-foreground rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-muted-foreground mb-2">OTHERS</h2>
          <nav className="space-y-1">
            {otherItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <item.icon className="h-5 w-5" />
                </motion.div>
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t">
        <span className="text-sm text-muted-foreground">v1.0.0</span>
      </div>
    </>
  )
}

