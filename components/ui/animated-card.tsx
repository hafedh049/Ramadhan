"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  onClick?: () => void
}

export function AnimatedCard({
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={cn("cursor-pointer", onClick ? "cursor-pointer" : "cursor-default")}
    >
      <Card className={cn("overflow-hidden border transition-colors", className)}>{children}</Card>
    </motion.div>
  )
}

export function AnimatedCardHeader({ className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("", className)} {...props} />
}

export function AnimatedCardFooter({ className, ...props }: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter className={cn("", className)} {...props} />
}

export function AnimatedCardTitle({ className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle className={cn("", className)} {...props} />
}

export function AnimatedCardDescription({ className, ...props }: React.ComponentProps<typeof CardDescription>) {
  return <CardDescription className={cn("", className)} {...props} />
}

export function AnimatedCardContent({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("", className)} {...props} />
}

