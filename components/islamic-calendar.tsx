"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// Islamic events data
const islamicEvents = [
  {
    id: 1,
    name: "Ramadan",
    description: "Holy month of fasting",
    date: new Date(2025, 2, 1), // March 1, 2025 (approximate)
    hijriMonth: "Ramadan",
    hijriDay: 1,
    hijriYear: 1446,
    type: "major",
  },
  {
    id: 2,
    name: "Laylat al-Qadr",
    description: "Night of Power",
    date: new Date(2025, 2, 27), // March 27, 2025 (approximate)
    hijriMonth: "Ramadan",
    hijriDay: 27,
    hijriYear: 1446,
    type: "major",
  },
  {
    id: 3,
    name: "Eid al-Fitr",
    description: "Festival of Breaking the Fast",
    date: new Date(2025, 3, 1), // April 1, 2025 (approximate)
    hijriMonth: "Shawwal",
    hijriDay: 1,
    hijriYear: 1446,
    type: "major",
  },
  {
    id: 4,
    name: "Dhul-Hijjah",
    description: "Month of Hajj",
    date: new Date(2025, 5, 7), // June 7, 2025 (approximate)
    hijriMonth: "Dhul-Hijjah",
    hijriDay: 1,
    hijriYear: 1446,
    type: "regular",
  },
  {
    id: 5,
    name: "Day of Arafah",
    description: "Second day of Hajj",
    date: new Date(2025, 5, 15), // June 15, 2025 (approximate)
    hijriMonth: "Dhul-Hijjah",
    hijriDay: 9,
    hijriYear: 1446,
    type: "major",
  },
  {
    id: 6,
    name: "Eid al-Adha",
    description: "Festival of Sacrifice",
    date: new Date(2025, 5, 16), // June 16, 2025 (approximate)
    hijriMonth: "Dhul-Hijjah",
    hijriDay: 10,
    hijriYear: 1446,
    type: "major",
  },
  {
    id: 7,
    name: "Islamic New Year",
    description: "First day of Muharram",
    date: new Date(2025, 6, 7), // July 7, 2025 (approximate)
    hijriMonth: "Muharram",
    hijriDay: 1,
    hijriYear: 1447,
    type: "major",
  },
  {
    id: 8,
    name: "Ashura",
    description: "10th day of Muharram",
    date: new Date(2025, 6, 16), // July 16, 2025 (approximate)
    hijriMonth: "Muharram",
    hijriDay: 10,
    hijriYear: 1447,
    type: "major",
  },
  {
    id: 9,
    name: "Mawlid al-Nabi",
    description: "Birth of Prophet Muhammad",
    date: new Date(2025, 8, 15), // September 15, 2025 (approximate)
    hijriMonth: "Rabi' al-Awwal",
    hijriDay: 12,
    hijriYear: 1447,
    type: "major",
  },
]

// Function to get upcoming events
const getUpcomingEvents = (count = 3) => {
  const now = new Date()
  return islamicEvents
    .filter((event) => event.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, count)
}

// Function to format date
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}

// Function to calculate days remaining
const getDaysRemaining = (date: Date) => {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function IslamicCalendar() {
  const [upcomingEvents, setUpcomingEvents] = useState(getUpcomingEvents())
  const [currentPage, setCurrentPage] = useState(0)
  const eventsPerPage = 3

  // Update days remaining every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setUpcomingEvents(getUpcomingEvents())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const totalPages = Math.ceil(islamicEvents.length / eventsPerPage)

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  const paginatedEvents = islamicEvents
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
          Islamic Calendar
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePrevPage} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentPage + 1}/{totalPages}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextPage} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {paginatedEvents.map((event, index) => {
          const daysRemaining = getDaysRemaining(event.date)
          const isPast = daysRemaining < 0

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                event.type === "major"
                  ? "border-primary/20 bg-primary/5"
                  : "border-muted hover:border-muted-foreground/20"
              } transition-all`}
            >
              <div
                className={`w-14 h-14 rounded-lg ${
                  event.type === "major" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                } flex flex-col items-center justify-center text-xs`}
              >
                <span className="font-bold text-sm">{event.date.getDate()}</span>
                <span>{event.date.toLocaleString("default", { month: "short" })}</span>
                <span className="text-[10px] opacity-70">{event.date.getFullYear()}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{event.name}</h3>
                  {!isPast && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        daysRemaining <= 7 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {daysRemaining} days
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.hijriDay} {event.hijriMonth} {event.hijriYear} AH
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="pt-2 text-center">
        <Button variant="link" size="sm" className="text-xs text-primary" onClick={handleNextPage}>
          View More Events
        </Button>
      </div>
    </div>
  )
}

