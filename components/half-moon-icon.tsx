import type React from "react"

interface HalfMoonIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function HalfMoonIcon({ className, ...props }: HalfMoonIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
      <path d="M12 2a10 10 0 0 1 0 20z" />
    </svg>
  )
}

