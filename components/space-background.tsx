"use client"
import { motion } from "framer-motion"

export function SpaceBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background">
        {/* Stars - increased quantity and speed */}
        {Array.from({ length: 70 }).map((_, i) => (
          <Star key={`star-${i}`} />
        ))}

        {/* Moons - increased speed */}
        {Array.from({ length: 12 }).map((_, i) => (
          <Moon key={`moon-${i}`} />
        ))}

        {/* Half Moons - increased speed and rotation */}
        {Array.from({ length: 8 }).map((_, i) => (
          <HalfMoon key={`half-moon-${i}`} />
        ))}
      </div>
    </div>
  )
}

function Star() {
  const size = Math.random() * 3 + 1
  const opacity = Math.random() * 0.7 + 0.3
  // Faster animation: reduced duration from 30-90 to 15-45 seconds
  const duration = Math.random() * 30 + 15
  const delay = Math.random() * -15

  const colors = ["bg-blue-400", "bg-indigo-400", "bg-purple-400", "bg-pink-400", "bg-white"]

  const color = colors[Math.floor(Math.random() * colors.length)]

  return (
    <motion.div
      className={`absolute rounded-full ${color} pointer-events-none`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity,
        boxShadow: `0 0 ${size * 2}px ${size / 2}px ${color.replace("bg-", "text-")}`,
      }}
      animate={{
        // Increased movement distance from -50/+50 to -80/+80
        x: [0, Math.random() * 160 - 80],
        y: [0, Math.random() * 160 - 80],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "linear",
        delay,
      }}
    />
  )
}

function Moon() {
  const size = Math.random() * 20 + 10
  const opacity = Math.random() * 0.5 + 0.2
  // Faster animation: reduced duration from 60-180 to 30-90 seconds
  const duration = Math.random() * 60 + 30
  const delay = Math.random() * -30

  return (
    <motion.div
      className="absolute rounded-full bg-gray-300 pointer-events-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity,
        boxShadow: `0 0 ${size}px ${size / 4}px rgba(255, 255, 255, 0.2)`,
      }}
      animate={{
        // Increased movement distance from -100/+100 to -150/+150
        x: [0, Math.random() * 300 - 150],
        y: [0, Math.random() * 300 - 150],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "linear",
        delay,
      }}
    />
  )
}

function HalfMoon() {
  const size = Math.random() * 30 + 15
  const opacity = Math.random() * 0.5 + 0.2
  // Faster animation: reduced duration from 60-180 to 30-90 seconds
  const duration = Math.random() * 60 + 30
  const delay = Math.random() * -30
  const rotation = Math.random() * 360

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity,
        transform: `rotate(${rotation}deg)`,
        overflow: "hidden",
        borderRadius: "50%",
      }}
      animate={{
        // Increased movement distance from -100/+100 to -150/+150
        x: [0, Math.random() * 300 - 150],
        y: [0, Math.random() * 300 - 150],
        // Faster rotation: from rotation+360 to rotation+720 (two full rotations)
        rotate: [rotation, rotation + 720],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "linear",
        delay,
      }}
    >
      <div
        className="absolute bg-gray-300"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          boxShadow: `0 0 ${size / 2}px ${size / 4}px rgba(255, 255, 255, 0.2)`,
        }}
      />
      <div
        className="absolute bg-background"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          left: `${size * 0.25}px`,
        }}
      />
    </motion.div>
  )
}

