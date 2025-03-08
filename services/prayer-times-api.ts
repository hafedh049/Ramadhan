export interface PrayerTimes {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  [key: string]: string
}

export interface PrayerTimesWithNext {
  times: PrayerTimes
  nextPrayer: {
    name: string
    time: string
    timeRemaining: string
  }
}

// Get prayer times for a specific location
export const getPrayerTimes = async (
  latitude = 51.5074, // Default to London
  longitude = -0.1278,
  method = 2, // Default to ISNA
): Promise<PrayerTimesWithNext> => {
  try {
    const today = new Date()
    const date = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`,
    )

    const data = await response.json()

    if (data.code === 200 && data.status === "OK") {
      const timings = data.data.timings

      const prayerTimes: PrayerTimes = {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha,
      }

      const nextPrayer = calculateNextPrayer(prayerTimes)

      return {
        times: prayerTimes,
        nextPrayer,
      }
    }

    throw new Error("Failed to fetch prayer times")
  } catch (error) {
    console.error("Error fetching prayer times:", error)

    // Return fallback data
    const fallbackTimes: PrayerTimes = {
      fajr: "05:12",
      sunrise: "06:43",
      dhuhr: "12:30",
      asr: "15:45",
      maghrib: "18:32",
      isha: "20:00",
    }

    return {
      times: fallbackTimes,
      nextPrayer: calculateNextPrayer(fallbackTimes),
    }
  }
}

// Calculate the next prayer and time remaining
export const calculateNextPrayer = (
  prayerTimes: PrayerTimes,
): { name: string; time: string; timeRemaining: string } => {
  const now = new Date()
  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Sunrise", time: prayerTimes.sunrise },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
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
      Number.parseInt(prayerTimes.fajr.split(":")[0], 10),
      Number.parseInt(prayerTimes.fajr.split(":")[1], 10),
      0,
      0,
    )

    nextPrayer = {
      name: "Fajr (Tomorrow)",
      time: prayerTimes.fajr,
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
    name: nextPrayer.name,
    time: formattedTime,
    timeRemaining,
  }
}

// Get Hijri date
export const getHijriDate = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.aladhan.com/v1/gToH")
    const data = await response.json()

    if (data.code === 200 && data.status === "OK") {
      const hijri = data.data.hijri
      return `${hijri.day} ${hijri.month.en} ${hijri.year}`
    }

    throw new Error("Failed to fetch Hijri date")
  } catch (error) {
    console.error("Error fetching Hijri date:", error)

    // Return fallback data
    const today = new Date()
    return `${today.getDate()} Ramadan ${today.getFullYear() - 579}`
  }
}

// Get user's location - Modified to handle permission errors better
export const getUserLocation = async (): Promise<{ latitude: number; longitude: number }> => {
  // Default coordinates (London)
  const defaultCoordinates = {
    latitude: 51.5074,
    longitude: -0.1278,
  }

  // Check if geolocation is available
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser")
    return defaultCoordinates
  }

  try {
    // Try to get the user's position with a timeout
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Geolocation request timed out"))
      }, 5000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId)
          resolve(position)
        },
        (error) => {
          clearTimeout(timeoutId)
          reject(error)
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
      )
    })

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }
  } catch (error) {
    // Handle specific geolocation errors
    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for geolocation")
          break
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable")
          break
        case error.TIMEOUT:
          console.log("The request to get user location timed out")
          break
      }
    } else {
      console.log("Error getting location:", error)
    }

    // Return default coordinates if geolocation fails
    return defaultCoordinates
  }
}

