"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Toast {
  id: string
  title: string
  description?: string
  action?: React.ReactNode
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, action }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, action }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-background border rounded-lg shadow-lg p-4 flex items-start gap-3"
            >
              <div className="flex-1">
                <h3 className="font-medium">{toast.title}</h3>
                {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                {toast.action}
                <button onClick={() => dismiss(toast.id)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const toast = (props: Omit<Toast, "id">) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("toast", { detail: props })
    window.dispatchEvent(event)
  }
}

export function ToastAction({
  altText,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  altText: string
}) {
  return (
    <button
      className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground"
      {...props}
    >
      {children || altText}
    </button>
  )
}

