"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, BookOpen, FileText, ArrowRight, Bell, MapPin, Loader2, Sparkles, Heart } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { surahs } from "@/data/surahs"
import { duas } from "@/data/duas"
import { getPrayerTimes, getHijriDate, getUserLocation, type PrayerTimes } from "@/services/prayer-times-api"
import { toast } from "@/components/ui/use-toast"
import { RamadhaneLogo } from "@/components/ramadhane-logo"
import { IslamicReminders } from "@/components/islamic-reminders"
import { IslamicCalendar } from "@/components/islamic-calendar"

export default function DashboardPage() {
  const { theme } = useTheme()
  const [date, setDate] = useState<Date>(new Date())
  const [hijriDate, setHijriDate] = useState<string>("")
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; timeRemaining: string }>({
    name: "Fajr",
    time: "05:12 AM",
    timeRemaining: "2h 30m",
  })
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(true)
  const [location, setLocation] = useState<string>("Your Location")

  // Update the date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Format the date
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Fetch Hijri date
  useEffect(() => {
    const fetchHijriDate = async () => {
      try {
        const hijri = await getHijriDate()
        setHijriDate(hijri)
      } catch (error) {
        console.error("Error fetching Hijri date:", error)
        setHijriDate("15 Ramadan 1445") // Fallback
      }
    }

    fetchHijriDate()
  }, [])

  // Fetch prayer times
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setIsLoadingPrayers(true)
      try {
        // Get user's location
        const coords = await getUserLocation()

        // Try to get location name using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
          )
          const data = await response.json()
          if (data && data.address) {
            const city =
              data.address.city || data.address.town || data.address.village || data.address.county || "Your Location"
            setLocation(city)
          }
        } catch (error) {
          console.log("Could not get location name:", error)
        }

        // Get prayer times
        const data = await getPrayerTimes(coords.latitude, coords.longitude)
        setPrayerTimes(data.times)
        setNextPrayer(data.nextPrayer)
        setIsLoadingPrayers(false)
      } catch (error) {
        console.error("Error fetching prayer times:", error)
        // Use fallback data
        const fallbackTimes = {
          fajr: "05:12",
          sunrise: "06:43",
          dhuhr: "12:30",
          asr: "15:45",
          maghrib: "18:32",
          isha: "20:00",
        }
        setPrayerTimes(fallbackTimes)
        setIsLoadingPrayers(false)

        toast({
          title: "Location Access Denied",
          description: "Using default prayer times. For accurate times, please allow location access.",
        })
      }
    }

    fetchPrayerTimes()
  }, [])

  // Update time remaining every second
  useEffect(() => {
    if (!prayerTimes) return

    const updateTimeRemaining = () => {
      const { nextPrayer } = getPrayerTimesWithNext(prayerTimes)
      setNextPrayer(nextPrayer)
    }

    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [prayerTimes])

  // Helper function to calculate next prayer without API call
  const getPrayerTimesWithNext = (
    times: PrayerTimes,
  ): { times: PrayerTimes; nextPrayer: { name: string; time: string; timeRemaining: string } } => {
    const now = new Date()
    const prayers = [
      { name: "Fajr", time: times.fajr },
      { name: "Sunrise", time: times.sunrise },
      { name: "Dhuhr", time: times.dhuhr },
      { name: "Asr", time: times.asr },
      { name: "Maghrib", time: times.maghrib },
      { name: "Isha", time: times.isha },
    ]

    // Convert prayer times to Date objects
    const prayerDateTimes = prayers.map((prayer) => {
      const [hours, minutes] = prayer.time.split(":").map(Number)
      const prayerDate = new Date(now)
      prayerDate.setHours(hours, minutes, 0, 0)
      return { ...prayer, dateTime: prayerDate }
    })

    // Find the next prayer
    let nextPrayer = prayerDateTimes.find((prayer) => prayer.dateTime > now)

    // If no prayer is found, it means all prayers for today have passed
    // So the next prayer is Fajr of tomorrow
    if (!nextPrayer) {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(
        Number.parseInt(times.fajr.split(":")[0], 10),
        Number.parseInt(times.fajr.split(":")[1], 10),
        0,
        0,
      )

      nextPrayer = {
        name: "Fajr (Tomorrow)",
        time: times.fajr,
        dateTime: tomorrow,
      }
    }

    // Calculate time remaining
    const diffMs = nextPrayer.dateTime.getTime() - now.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000)

    const timeRemaining = `${diffHrs}h ${diffMins}m ${diffSecs}s`

    // Format time for display (12-hour format)
    const hours = nextPrayer.dateTime.getHours()
    const minutes = nextPrayer.dateTime.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`

    return {
      times,
      nextPrayer: {
        name: nextPrayer.name,
        time: formattedTime,
        timeRemaining,
      },
    }
  }

  // Mock data for reading progress
  const readingProgress = [
    { id: 1, name: "Al-Fatihah", progress: 100 },
    { id: 2, name: "Al-Baqarah", progress: 75 },
    { id: 3, name: "Ali 'Imran", progress: 40 },
    { id: 4, name: "An-Nisa", progress: 20 },
  ]

  // Calculate overall Quran progress
  const totalAyahs = surahs.reduce((total, surah) => total + surah.numberOfAyahs, 0)
  const readAyahs = readingProgress.reduce((total, surah) => {
    const fullSurah = surahs.find((s) => s.id === surah.id)
    return total + (fullSurah ? (fullSurah.numberOfAyahs * surah.progress) / 100 : 0)
  }, 0)
  const overallProgress = Math.round((readAyahs / totalAyahs) * 100)

  return (
    <div className="p-4 md:p-6 space-y-6 fancy-scrollbar">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-6 md:p-8 mb-8 border"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 p-4">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <RamadhaneLogo />
              <h1 className="text-3xl font-bold">Assalamu'alaikum</h1>
            </div>
            <div className="flex flex-wrap items-center text-muted-foreground mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
              <span className="mx-2">•</span>
              <span>{hijriDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg p-3 backdrop-blur-sm border border-primary/20 shadow-sm">
            {isLoadingPrayers ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <div>
                  <p className="font-medium">Loading prayer times...</p>
                </div>
              </div>
            ) : (
              <>
                <Bell className="h-5 w-5" />
                <div>
                  <p className="font-medium">
                    {nextPrayer.name} in {nextPrayer.timeRemaining}
                  </p>
                  <p className="text-sm">{nextPrayer.time}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5 border shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Quran Journey</h2>
            <p className="text-muted-foreground">You've completed {overallProgress}% of the Quran</p>
          </div>
          <Link href="/surah">
            <Button className="bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
              Continue Reading
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 bg-background/50 rounded-full h-2.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="border rounded-xl p-5 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Prayer Times
            </h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{location}</span>
            </div>
          </div>

          <div className="space-y-3 fancy-scrollbar max-h-[300px] overflow-auto pr-1">
            {isLoadingPrayers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              prayerTimes && (
                <>
                  {[
                    { name: "Fajr", time: prayerTimes.fajr },
                    { name: "Sunrise", time: prayerTimes.sunrise },
                    { name: "Dhuhr", time: prayerTimes.dhuhr },
                    { name: "Asr", time: prayerTimes.asr },
                    { name: "Maghrib", time: prayerTimes.maghrib },
                    { name: "Isha", time: prayerTimes.isha },
                  ].map((prayer, index) => (
                    <motion.div
                      key={prayer.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                      className={`flex justify-between items-center p-2 rounded-lg ${
                        prayer.name === nextPrayer.name.split(" ")[0]
                          ? "bg-primary/10 text-primary font-medium border border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <span className="font-medium">{prayer.name}</span>
                      <span className={prayer.name === nextPrayer.name.split(" ")[0] ? "" : "text-muted-foreground"}>
                        {prayer.time}
                      </span>
                    </motion.div>
                  ))}
                </>
              )
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="border rounded-xl p-5 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Reading Progress
            </h2>
            <Link href="/surah" className="text-sm text-primary hover:underline flex items-center">
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-4 fancy-scrollbar max-h-[300px] overflow-auto pr-1">
            {readingProgress.map((surah, index) => (
              <motion.div
                key={surah.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{surah.name}</span>
                  <span className="text-sm text-muted-foreground">{surah.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${surah.progress}%` }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="border rounded-xl p-5 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Daily Duas
            </h2>
            <Link href="/dua" className="text-sm text-primary hover:underline flex items-center">
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-3 fancy-scrollbar max-h-[300px] overflow-auto pr-1">
            {duas
              .filter((dua) => dua.category === "Morning & Evening" || dua.category === "Daily")
              .slice(0, 4)
              .map((dua, index) => (
                <motion.div
                  key={dua.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-muted transition-all"
                >
                  <span className="font-medium">{dua.name}</span>
                  <span className="text-sm text-muted-foreground">{dua.category}</span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="border rounded-xl p-5 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Daily Reminder</h2>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <RamadhaneLogo showText={false} className="h-6 w-6" />
            </div>
          </div>

          <IslamicReminders />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="border rounded-xl p-5 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all"
        >
          <IslamicCalendar />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="text-center mt-8 pt-4 border-t"
      >
        <p className="text-muted-foreground">
          Ramadhane © {new Date().getFullYear()} • Made with <Heart className="inline-block h-4 w-4 text-red-500" /> for
          the Muslim community
        </p>
      </motion.div>
    </div>
  )
}

