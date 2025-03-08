"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Play, Bookmark, BookmarkCheck, Info, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { duaCategories, duas, type Dua } from "@/data/duas"
import { AudioPlayer } from "@/components/audio-player"
import { InfoModal } from "@/components/info-modal"
import { saveBookmark, isBookmarked } from "@/services/bookmark-service"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useSearchParams } from "next/navigation"

export default function DuaPage() {
  const searchParams = useSearchParams()
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isDuaBookmarked, setIsDuaBookmarked] = useState(false)
  const [autoScroll, setAutoScroll] = useState(false)
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy")
  const [duaAudioUrl, setDuaAudioUrl] = useState("")
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

  // Handle URL params for direct navigation
  useEffect(() => {
    const duaId = searchParams.get("id")

    if (duaId && duas.length > 0) {
      const id = Number.parseInt(duaId, 10)
      const dua = duas.find((d) => d.id === id)

      if (dua) {
        setSelectedDua(dua)
      }
    } else if (!selectedDua && duas.length > 0) {
      // Set the first dua as selected by default
      setSelectedDua(duas[0])
    }
  }, [searchParams, selectedDua])

  useEffect(() => {
    if (selectedDua) {
      // Update dua audio URL (using a demo URL based on ID)
      setDuaAudioUrl(`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(selectedDua.id % 10) + 1}.mp3`)

      // Reset audio player
      setShowAudioPlayer(false)

      // Check if dua is bookmarked
      setIsDuaBookmarked(isBookmarked("dua", selectedDua.id.toString()))
    }
  }, [selectedDua])

  const filteredDuas = duas.filter((dua) => {
    const matchesSearch =
      dua.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory ? dua.category === activeCategory : true

    return matchesSearch && matchesCategory
  })

  const handlePlayAudio = () => {
    setShowAudioPlayer(true)
  }

  const handleDownloadAudio = () => {
    if (!selectedDua) return

    // Create an anchor element and trigger download
    const a = document.createElement("a")
    a.href = duaAudioUrl
    a.download = `dua-${selectedDua.id}-${selectedDua.name}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: "Download Started",
      description: `${selectedDua.name} audio is being downloaded.`,
      action: <ToastAction altText="Cancel">Cancel</ToastAction>,
    })
  }

  const toggleBookmarkDua = () => {
    if (!selectedDua) return

    if (isDuaBookmarked) {
      // Find and remove the bookmark
      const bookmarks = JSON.parse(localStorage.getItem("ramadhan-pro-bookmarks") || "[]")
      const updatedBookmarks = bookmarks.filter(
        (b: any) => !(b.type === "dua" && b.reference === selectedDua.id.toString()),
      )
      localStorage.setItem("ramadhan-pro-bookmarks", JSON.stringify(updatedBookmarks))
      setIsDuaBookmarked(false)

      toast({
        title: "Bookmark Removed",
        description: `${selectedDua.name} has been removed from your bookmarks.`,
      })
    } else {
      saveBookmark({
        type: "dua",
        title: selectedDua.name,
        reference: selectedDua.id.toString(),
      })

      setIsDuaBookmarked(true)

      toast({
        title: "Bookmark Added",
        description: `${selectedDua.name} has been added to your bookmarks.`,
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
      <div className="w-full md:w-1/3 lg:w-1/4 border-r p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-2">Dua</h1>
        <p className="text-muted-foreground mb-4">Find and read supplications for various occasions</p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search dua..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-4 overflow-x-auto pb-2">
          <div className="flex gap-2 flex-nowrap min-w-max">
            <Badge
              variant={activeCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveCategory(null)}
            >
              All
            </Badge>
            {duaCategories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {filteredDuas.map((dua) => (
              <motion.div
                key={dua.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedDua(dua)}
                className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 border ${
                  selectedDua?.id === dua.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedDua?.id === dua.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {dua.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{dua.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">Category: {dua.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredDuas.length === 0 && (
            <div className="text-center py-10">
              <Search className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No duas found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords or select a different category
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedDua && (
        <motion.div
          key={selectedDua.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 overflow-auto"
          ref={contentRef}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedDua.name}</h2>
              <p className="text-muted-foreground">Category: {selectedDua.category}</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={handlePlayAudio}>
                <Play className="h-4 w-4" />
                <span className="sr-only">Play Audio</span>
              </Button>
              <Button size="icon" variant="outline" onClick={toggleBookmarkDua}>
                {isDuaBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
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
                audioSrc={duaAudioUrl}
                title={`${selectedDua.name}`}
                onDownload={handleDownloadAudio}
                onReciterChange={handleReciterChange}
                reciterId={selectedReciter}
              />
            </div>
          )}

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="arabic">Arabic</TabsTrigger>
              <TabsTrigger value="translation">Translation</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-6 pt-4">
              <div className="flex flex-col items-center mb-4">
                <div className="text-2xl font-arabic text-center leading-loose mb-6 max-w-2xl">
                  {selectedDua.arabic}
                </div>
                <p className="text-muted-foreground text-center mb-4 max-w-2xl">{selectedDua.transliteration}</p>
                <p className="text-center max-w-2xl">{selectedDua.translation}</p>
                <p className="text-sm text-muted-foreground mt-4">Reference: {selectedDua.reference}</p>
              </div>
            </TabsContent>
            <TabsContent value="arabic" className="space-y-6 pt-4">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-arabic text-center leading-loose mb-4 max-w-2xl">
                  {selectedDua.arabic}
                </div>
                <p className="text-muted-foreground text-center mb-2 max-w-2xl">{selectedDua.transliteration}</p>
              </div>
            </TabsContent>
            <TabsContent value="translation" className="space-y-6 pt-4">
              <div className="flex flex-col items-center">
                <p className="text-center text-lg max-w-2xl mb-4">{selectedDua.translation}</p>
                <p className="text-sm text-muted-foreground">Reference: {selectedDua.reference}</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Related Duas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {duas
                .filter((dua) => dua.category === selectedDua.category && dua.id !== selectedDua.id)
                .slice(0, 4)
                .map((dua) => (
                  <motion.div
                    key={dua.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg cursor-pointer border hover:border-primary/50"
                    onClick={() => setSelectedDua(dua)}
                  >
                    <h4 className="font-medium">{dua.name}</h4>
                    <p className="text-xs text-muted-foreground">Category: {dua.category}</p>
                  </motion.div>
                ))}
            </div>
          </div>

          <InfoModal
            title={`About ${selectedDua.name}`}
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
          >
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {selectedDua.name}
              </p>
              <p>
                <strong>Arabic Name:</strong> {selectedDua.arabicName}
              </p>
              <p>
                <strong>Category:</strong> {selectedDua.category}
              </p>
              <p>
                <strong>Reference:</strong> {selectedDua.reference}
              </p>
              <p>
                <strong>Description:</strong> This dua is recommended for {selectedDua.category.toLowerCase()}{" "}
                occasions. It is a supplication that Muslims recite to seek Allah's blessings and guidance.
              </p>
              <p>
                <strong>When to Recite:</strong> This dua is typically recited during{" "}
                {selectedDua.category.toLowerCase()} activities or situations.
              </p>
              <p>
                <strong>Virtues:</strong> Reciting this dua with sincerity and understanding brings numerous spiritual
                benefits and helps strengthen one's connection with Allah.
              </p>
            </div>
          </InfoModal>
        </motion.div>
      )}
    </div>
  )
}

