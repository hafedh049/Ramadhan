"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, Volume1, VolumeX, Download, SkipBack, SkipForward, User } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { reciters } from "@/services/quran-api"

interface AudioPlayerProps {
  audioSrc: string
  title: string
  onDownload?: () => void
  onReciterChange?: (reciterId: string) => void
  reciterId?: string
}

export function AudioPlayer({
  audioSrc,
  title,
  onDownload,
  onReciterChange,
  reciterId = "ar.alafasy",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [selectedReciter, setSelectedReciter] = useState(reciterId)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
      setHasError(false)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    const handleError = () => {
      setHasError(true)
      setIsPlaying(false)
      toast({
        title: "Audio Error",
        description: "The audio file could not be loaded. Using demo audio instead.",
      })

      // Set a demo audio file as fallback
      audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("error", handleError)

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("error", handleError)
      cancelAnimationFrame(animationRef.current as number)
    }
  }, [])

  // Update audio source when reciter changes
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const wasPlaying = !audio.paused
      audio.pause()

      // Reset state
      setCurrentTime(0)
      setIsPlaying(false)

      // Update audio source
      audio.src = audioSrc

      // Resume playback if it was playing
      if (wasPlaying) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true)
            animationRef.current = requestAnimationFrame(whilePlaying)
          })
          .catch((error) => {
            console.error("Error playing audio:", error)
            setHasError(true)
          })
      }
    }
  }, [audioSrc])

  // Handle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (hasError) {
      toast({
        title: "Audio Unavailable",
        description: "Using demo audio instead of the requested file.",
      })
    }

    if (!isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            animationRef.current = requestAnimationFrame(whilePlaying)
          })
          .catch((error) => {
            console.error("Playback error:", error)
            setHasError(true)
            toast({
              title: "Playback Error",
              description: "There was an error playing the audio.",
            })
          })
      }
    } else {
      audio.pause()
      setIsPlaying(false)
      cancelAnimationFrame(animationRef.current as number)
    }
  }

  const whilePlaying = () => {
    const audio = audioRef.current
    if (audio) {
      setCurrentTime(audio.currentTime)
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
  }

  // Handle time change
  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = value[0]
      setVolume(value[0])
      setIsMuted(value[0] === 0)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current
    if (audio) {
      if (isMuted) {
        audio.volume = volume
        setIsMuted(false)
      } else {
        audio.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Format time
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Skip forward/backward
  const skipForward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 10, duration)
    }
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0)
    }
  }

  // Handle reciter change
  const handleReciterChange = (value: string) => {
    setSelectedReciter(value)
    if (onReciterChange) {
      onReciterChange(value)
    }
  }

  // Handle direct MP3 download
  const handleDownload = () => {
    if (onDownload) {
      onDownload()
      return
    }

    // If no onDownload prop is provided, handle download directly
    if (audioSrc) {
      const link = document.createElement("a")
      link.href = audioSrc
      link.download = `${title.replace(/\s+/g, "_")}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: `${title} is being downloaded as MP3.`,
      })
    } else {
      toast({
        title: "Download Failed",
        description: "Audio source is not available for download.",
      })
    }
  }

  return (
    <div className="w-full bg-muted/30 rounded-lg p-3 border">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-2">
        <div className="text-sm font-medium truncate flex-1">
          {hasError ? "Demo Audio (Original unavailable)" : title}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <User className="h-4 w-4 text-muted-foreground hidden md:block" />
          <Select value={selectedReciter} onValueChange={handleReciterChange}>
            <SelectTrigger className="h-8 text-xs md:text-sm w-full md:w-[180px]">
              <SelectValue placeholder="Select reciter" />
            </SelectTrigger>
            <SelectContent>
              {reciters.map((reciter) => (
                <SelectItem key={reciter.id} value={reciter.id}>
                  {reciter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.01}
          onValueChange={handleTimeChange}
          className="w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipBackward}>
            <SkipBack className="h-4 w-4" />
            <span className="sr-only">Skip backward</span>
          </Button>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" size="icon" className="h-10 w-10 rounded-full" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
          </motion.div>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipForward}>
            <SkipForward className="h-4 w-4" />
            <span className="sr-only">Skip forward</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            <span className="sr-only">Volume</span>
          </Button>

          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20"
          />

          <Button variant="outline" size="icon" className="h-8 w-8 ml-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

