import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface RamadhaneLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function RamadhaneLogo({ className, size = "md", showText = true }: RamadhaneLogoProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  }

  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <div className="relative overflow-hidden rounded-full">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-Fsw4GiyQv6mgG6RMO3XbmzwC2W8Wj7.png"
          alt="Ramadhane Logo"
          width={sizes[size].width}
          height={sizes[size].height}
          className="object-cover"
          priority
        />
      </div>
      {showText && <span className="ml-2 font-bold text-xl text-white uppercase">Ramdhane</span>}
    </Link>
  )
}

