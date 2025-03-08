"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bookmark, Trash2, Search, BookOpen, FileText, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBookmarks, removeBookmark, type Bookmark as BookmarkType } from "@/services/bookmark-service"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    // Load bookmarks from localStorage
    const loadedBookmarks = getBookmarks()
    setBookmarks(loadedBookmarks)
  }, [])

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = activeTab === "all" ? true : bookmark.type === activeTab

    return matchesSearch && matchesType
  })

  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id)
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id))

    toast({
      title: "Bookmark Removed",
      description: "The bookmark has been removed from your collection.",
    })
  }

  const handleOpenBookmark = (bookmark: BookmarkType) => {
    if (bookmark.type === "surah") {
      router.push(`/surah?id=${bookmark.reference}`)
    } else if (bookmark.type === "dua") {
      router.push(`/dua?id=${bookmark.reference}`)
    } else if (bookmark.type === "ayah") {
      const [surahId, ayahNumber] = bookmark.reference.split(":")
      router.push(`/surah?id=${surahId}&ayah=${ayahNumber}`)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Bookmarks</h1>
        <p className="text-muted-foreground">Manage your saved surahs, duas, and ayahs</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bookmarks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="surah">Surahs</TabsTrigger>
          <TabsTrigger value="dua">Duas</TabsTrigger>
          <TabsTrigger value="ayah">Ayahs</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="pt-4">
          {filteredBookmarks.length > 0 ? (
            <div className="space-y-4">
              {filteredBookmarks.map((bookmark) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {bookmark.type === "surah" && <BookOpen className="h-5 w-5" />}
                      {bookmark.type === "dua" && <FileText className="h-5 w-5" />}
                      {bookmark.type === "ayah" && <Bookmark className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{bookmark.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {bookmark.type.charAt(0).toUpperCase() + bookmark.type.slice(1)} • Saved on{" "}
                        {formatDate(bookmark.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenBookmark(bookmark)}>
                      Open
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveBookmark(bookmark.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Bookmark className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No bookmarks found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try searching with different keywords or select a different category"
                  : "You haven't saved any bookmarks yet. Start by bookmarking your favorite surahs, duas, or ayahs."}
              </p>
              {!searchQuery && (
                <div className="flex justify-center gap-4">
                  <Button onClick={() => router.push("/surah")}>Browse Surahs</Button>
                  <Button variant="outline" onClick={() => router.push("/dua")}>
                    Browse Duas
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

