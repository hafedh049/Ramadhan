"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Play, Bookmark, BookmarkCheck, Info, Download, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { surahs as localSurahs, getAyahsForSurah as getLocalAyahs } from "@/data/surahs"
import { AudioPlayer } from "@/components/audio-player"
import { InfoModal } from "@/components/info-modal"
import { saveBookmark, isBookmarked } from "@/services/bookmark-service"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import {
  getAllSurahs,
  getAyahsForSurah,
  getSurahAudioUrl,
  type QuranApiSurah,
  type QuranApiVerse,
} from "@/services/quran-api"
import { useSearchParams } from "next/navigation"

export default function SurahPage() {
  const searchParams = useSearchParams()
  const [surahs, setSurahs] = useState<QuranApiSurah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<QuranApiSurah | null>(null)
  const [ayahs, setAyahs] = useState<QuranApiVerse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [revelationType, setRevelationType] = useState<string | null>(null)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Record<number, boolean>>({})
  const [isSurahBookmarked, setIsSurahBookmarked] = useState(false)
  const [autoScroll, setAutoScroll] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false)
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy")
  const [surahAudioUrl, setSurahAudioUrl] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  // Load settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("ramadhan-pro-settings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setAutoScroll(parsedSettings.autoScroll || false)
      } catch (error) {
        console.error("Error parsing settings:", error)
      }
    }
  }, [])

  // Fetch all surahs
  useEffect(() => {
    const fetchSurahs = async () => {
      setIsLoading(true)
      try {
        const data = await getAllSurahs()
        if (data.length > 0) {
          setSurahs(data)
        } else {
          // Fallback to local data
          setSurahs(localSurahs)
        }
      } catch (error) {
        console.error("Error fetching surahs:", error)
        // Fallback to local data
        setSurahs(localSurahs)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSurahs()
  }, [])

  // Handle URL params for direct navigation
  useEffect(() => {
    if (surahs.length > 0) {
      const surahId = searchParams.get("id")
      const ayahNumber = searchParams.get("ayah")

      if (surahId) {
        const surahNumber = Number.parseInt(surahId, 10)
        const surah = surahs.find((s) => s.number === surahNumber)

        if (surah) {
          setSelectedSurah(surah)

          if (ayahNumber) {
            // Scroll to specific ayah after loading
            setTimeout(() => {
              const ayahElement = document.getElementById(`ayah-${ayahNumber}`)
              if (ayahElement) {
                ayahElement.scrollIntoView({ behavior: "smooth" })
              }
            }, 1000)
          }
        }
      } else if (!selectedSurah && surahs.length > 0) {
        // Set the first surah as selected by default
        setSelectedSurah(surahs[0])
      }
    }
  }, [surahs, searchParams, selectedSurah])

  // Fetch ayahs when selected surah changes
  useEffect(() => {
    if (selectedSurah) {
      const fetchAyahs = async () => {
        setIsLoadingAyahs(true)
        try {
          const verses = await getAyahsForSurah(selectedSurah.number, selectedReciter)
          if (verses.length > 0) {
            setAyahs(verses)
          } else {
            // Fallback to local data
            setAyahs(
              getLocalAyahs(selectedSurah.number).map((ayah) => ({
                ...ayah,
                audio: "",
                audiosByReciter: {},
              })),
            )
          }
        } catch (error) {
          console.error(`Error fetching ayahs for surah ${selectedSurah.number}:`, error)
          // Fallback to local data
          setAyahs(
            getLocalAyahs(selectedSurah.number).map((ayah) => ({
              ...ayah,
              audio: "",
              audiosByReciter: {},
            })),
          )
        } finally {
          setIsLoadingAyahs(false)
        }

        // Update surah audio URL
        setSurahAudioUrl(getSurahAudioUrl(selectedSurah.number, selectedReciter))

        // Reset audio player
        setShowAudioPlayer(false)

        // Check if surah is bookmarked
        setIsSurahBookmarked(isBookmarked("surah", selectedSurah.number.toString()))

        // Check which ayahs are bookmarked
        const bookmarked: Record<number, boolean> = {}
        getLocalAyahs(selectedSurah.number).forEach((ayah) => {
          bookmarked[ayah.number] = isBookmarked("ayah", `${selectedSurah.number}:${ayah.number}`)
        })
        setBookmarkedAyahs(bookmarked)
      }

      fetchAyahs()
    }
  }, [selectedSurah, selectedReciter])

  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRevelationType = revelationType ? surah.revelationType === revelationType : true

    return matchesSearch && matchesRevelationType
  })

  const handlePlayAudio = () => {
    setShowAudioPlayer(true)
  }

  const handleDownloadAudio = () => {
    if (!selectedSurah) return

    // Create an anchor element and trigger download
    const a = document.createElement("a")
    a.href = surahAudioUrl
    a.download = `surah-${selectedSurah.number}-${selectedSurah.englishName}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: "Download Started",
      description: `${selectedSurah.englishName} audio is being downloaded.`,
      action: <ToastAction altText="Cancel">Cancel</ToastAction>,
    })
  }

  const toggleBookmarkSurah = () => {
    if (!selectedSurah) return

    if (isSurahBookmarked) {
      // Find and remove the bookmark
      const bookmarks = JSON.parse(localStorage.getItem("ramadhan-pro-bookmarks") || "[]")
      const updatedBookmarks = bookmarks.filter(
        (b: any) => !(b.type === "surah" && b.reference === selectedSurah.number.toString()),
      )
      localStorage.setItem("ramadhan-pro-bookmarks", JSON.stringify(updatedBookmarks))
      setIsSurahBookmarked(false)

      toast({
        title: "Bookmark Removed",
        description: `${selectedSurah.englishName} has been removed from your bookmarks.`,
      })
    } else {
      saveBookmark({
        type: "surah",
        title: selectedSurah.englishName,
        reference: selectedSurah.number.toString(),
      })

      setIsSurahBookmarked(true)

      toast({
        title: "Bookmark Added",
        description: `${selectedSurah.englishName} has been added to your bookmarks.`,
      })
    }
  }

  const toggleBookmarkAyah = (ayah: QuranApiVerse) => {
    if (!selectedSurah) return

    const reference = `${selectedSurah.number}:${ayah.number}`
    const isAyahBookmarked = bookmarkedAyahs[ayah.number]

    if (isAyahBookmarked) {
      // Find and remove the bookmark
      const bookmarks = JSON.parse(localStorage.getItem("ramadhan-pro-bookmarks") || "[]")
      const updatedBookmarks = bookmarks.filter((b: any) => !(b.type === "ayah" && b.reference === reference))
      localStorage.setItem("ramadhan-pro-bookmarks", JSON.stringify(updatedBookmarks))

      setBookmarkedAyahs((prev) => ({
        ...prev,
        [ayah.number]: false,
      }))

      toast({
        title: "Bookmark Removed",
        description: `Ayah ${ayah.number} has been removed from your bookmarks.`,
      })
    } else {
      saveBookmark({
        type: "ayah",
        title: `${selectedSurah.englishName} - Ayah ${ayah.number}`,
        reference,
      })

      setBookmarkedAyahs((prev) => ({
        ...prev,
        [ayah.number]: true,
      }))

      toast({
        title: "Bookmark Added",
        description: `Ayah ${ayah.number} has been added to your bookmarks.`,
      })
    }
  }

  // Handle reciter change
  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId)
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || !showAudioPlayer || !contentRef.current) return

    const interval = setInterval(() => {
      contentRef.current?.scrollBy({
        top: 1,
        behavior: "smooth",
      })
    }, 100)

    return () => clearInterval(interval)
  }, [autoScroll, showAudioPlayer])

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/3 lg:w-1/4 border-r p-4 overflow-auto fancy-scrollbar bg-background/50 backdrop-blur-sm rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Surah</h1>
        <p className="text-muted-foreground mb-4">Select and read here the surah you want to find!</p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search surah..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2">
            <Badge
              variant={revelationType === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setRevelationType(null)}
            >
              All
            </Badge>
            <Badge
              variant={revelationType === "Meccan" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setRevelationType("Meccan")}
            >
              Meccan
            </Badge>
            <Badge
              variant={revelationType === "Medinan" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setRevelationType("Medinan")}
            >
              Medinan
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredSurahs.map((surah) => (
                <motion.div
                  key={surah.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSurah(surah)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 border ${
                    selectedSurah?.number === surah.number
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedSurah?.number === surah.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {surah.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{surah.englishName}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {surah.englishNameTranslation} - {surah.numberOfAyahs} Ayahs
                    </p>
                  </div>
                  <Badge variant="outline">{surah.revelationType}</Badge>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredSurahs.length === 0 && (
              <div className="text-center py-10">
                <Search className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No surahs found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or select a different revelation type
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSurah && (
        <motion.div
          key={selectedSurah.number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 overflow-auto fancy-scrollbar bg-background/50 backdrop-blur-sm rounded-lg ml-0 md:ml-4"
          ref={contentRef}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{selectedSurah.englishName}</h2>
                <Badge variant="outline">{selectedSurah.revelationType}</Badge>
              </div>
              <p className="text-muted-foreground">
                {selectedSurah.englishNameTranslation} - {selectedSurah.numberOfAyahs} Ayahs
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={handlePlayAudio}>
                <Play className="h-4 w-4" />
                <span className="sr-only">Play Audio</span>
              </Button>
              <Button size="icon" variant="outline" onClick={toggleBookmarkSurah}>
                {isSurahBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                <span className="sr-only">Bookmark</span>
              </Button>
              <Button size="icon" variant="outline" onClick={handleDownloadAudio}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
              <Button size="icon" variant="outline" onClick={() => setIsInfoModalOpen(true)}>
                <Info className="h-4 w-4" />
                <span className="sr-only">Info</span>
              </Button>
            </div>
          </div>

          {showAudioPlayer && (
            <div className="mb-6">
              <AudioPlayer
                audioSrc={surahAudioUrl}
                title={`${selectedSurah.englishName} - ${selectedSurah.englishNameTranslation}`}
                onDownload={handleDownloadAudio}
                onReciterChange={handleReciterChange}
                reciterId={selectedReciter}
              />
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="text-4xl font-arabic text-center leading-loose">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="arabic">Arabic</TabsTrigger>
              <TabsTrigger value="translation">Translation</TabsTrigger>
            </TabsList>

            {isLoadingAyahs ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-6 pt-4">
                  {ayahs.map((ayah) => (
                    <motion.div
                      key={ayah.number}
                      id={`ayah-${ayah.number}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: ayah.number * 0.05 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          {ayah.number}
                        </div>
                        <div className="text-xl font-arabic text-right leading-loose">{ayah.text}</div>
                      </div>
                      <p className="text-muted-foreground mb-2">{ayah.transliteration}</p>
                      <div className="flex justify-between items-center">
                        <p>{ayah.translation}</p>
                        <Button size="icon" variant="ghost" onClick={() => toggleBookmarkAyah(ayah)}>
                          {bookmarkedAyahs[ayah.number] ? (
                            <BookmarkCheck className="h-4 w-4" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                          <span className="sr-only">Bookmark Ayah</span>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>
                <TabsContent value="arabic" className="space-y-6 pt-4">
                  {ayahs.map((ayah) => (
                    <motion.div
                      key={ayah.number}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: ayah.number * 0.05 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          {ayah.number}
                        </div>
                        <div className="text-2xl font-arabic text-right leading-loose">{ayah.text}</div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>
                <TabsContent value="translation" className="space-y-6 pt-4">
                  {ayahs.map((ayah) => (
                    <motion.div
                      key={ayah.number}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: ayah.number * 0.05 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          {ayah.number}
                        </div>
                        <div className="flex-1">
                          <p className="text-muted-foreground mb-2">{ayah.transliteration}</p>
                          <p>{ayah.translation}</p>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => toggleBookmarkAyah(ayah)}>
                          {bookmarkedAyahs[ayah.number] ? (
                            <BookmarkCheck className="h-4 w-4" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                          <span className="sr-only">Bookmark Ayah</span>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>
              </>
            )}
          </Tabs>

          <InfoModal
            title={`About ${selectedSurah.englishName}`}
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
          >
            {selectedSurah.number === 1 && (
              <div className="space-y-4">
                <p>
                  <strong>Name:</strong> {selectedSurah.englishName}
                </p>
                <p>
                  <strong>Meaning:</strong> The Opening
                </p>
                <p>
                  <strong>Number of Verses:</strong> {selectedSurah.numberOfAyahs}
                </p>
                <p>
                  <strong>Revelation Type:</strong> {selectedSurah.revelationType}
                </p>
                <p>
                  <strong>Period:</strong> Early Meccan
                </p>
                <p>
                  <strong>Description:</strong> Al-Fatihah, also known as "The Opening," is the first chapter of the
                  Quran. It consists of seven verses and is one of the most commonly recited prayers in Islam. Muslims
                  recite Al-Fatihah in each of their five daily prayers, making it the most repeated surah in the Quran.
                </p>
                <p>
                  The surah serves as an essential supplication to Allah, containing praise, worship, and a request for
                  guidance. It encapsulates the core message of the Quran and is often referred to as "Umm Al-Kitab"
                  (The Mother of the Book) due to its importance.
                </p>
                <p>
                  <strong>Virtues:</strong> The Prophet Muhammad (peace be upon him) referred to Al-Fatihah as the
                  greatest surah in the Quran. It is also known as "Ash-Shifa" (The Cure) because of its healing
                  properties when recited with faith.
                </p>
              </div>
            )}

            {selectedSurah.number === 2 && (
              <div className="space-y-4">
                <p>
                  <strong>Name:</strong> {selectedSurah.englishName}
                </p>
                <p>
                  <strong>Meaning:</strong> The Cow
                </p>
                <p>
                  <strong>Number of Verses:</strong> {selectedSurah.numberOfAyahs}
                </p>
                <p>
                  <strong>Revelation Type:</strong> {selectedSurah.revelationType}
                </p>
                <p>
                  <strong>Period:</strong> Early Medinan
                </p>
                <p>
                  <strong>Description:</strong> Al-Baqarah, meaning "The Cow," is the second and longest chapter of the
                  Quran with 286 verses. It was revealed in Medina and covers various aspects of Islamic law, history,
                  and guidance. The surah derives its name from the story of the cow mentioned in verses 67-73, where
                  Moses instructs his people to sacrifice a cow.
                </p>
                <p>
                  This surah contains many important teachings, including the famous Ayat al-Kursi (The Throne Verse,
                  2:255), which is considered one of the most powerful verses in the Quran. Al-Baqarah also includes
                  detailed guidance on various aspects of life, including prayer, fasting, pilgrimage, charity, and
                  financial transactions.
                </p>
                <p>
                  <strong>Key Themes:</strong> Faith, guidance, the stories of previous prophets, legal rulings, and the
                  establishment of the Muslim community.
                </p>
              </div>
            )}

            {selectedSurah.number > 2 && (
              <div className="space-y-4">
                <p>
                  <strong>Name:</strong> {selectedSurah.englishName}
                </p>
                <p>
                  <strong>Meaning:</strong> {selectedSurah.englishNameTranslation}
                </p>
                <p>
                  <strong>Number of Verses:</strong> {selectedSurah.numberOfAyahs}
                </p>
                <p>
                  <strong>Revelation Type:</strong> {selectedSurah.revelationType}
                </p>
                <p>
                  <strong>Description:</strong> This surah contains important teachings and guidance for believers. It
                  addresses various aspects of faith, worship, and daily life.
                </p>
                <p>
                  For more detailed information about this surah, please refer to authentic tafsir (exegesis) resources.
                </p>
              </div>
            )}
          </InfoModal>
        </motion.div>
      )}
    </div>
  )
}

