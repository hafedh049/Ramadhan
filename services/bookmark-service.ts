export interface Bookmark {
  id: string
  type: "surah" | "dua" | "ayah"
  title: string
  reference: string
  timestamp: number
}

// Save a bookmark
export const saveBookmark = (bookmark: Omit<Bookmark, "id" | "timestamp">): Bookmark => {
  // Generate a unique ID
  const id = `${bookmark.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = Date.now()

  const newBookmark: Bookmark = {
    ...bookmark,
    id,
    timestamp,
  }

  // Get existing bookmarks
  const existingBookmarks = getBookmarks()

  // Add new bookmark
  const updatedBookmarks = [...existingBookmarks, newBookmark]

  // Save to localStorage
  localStorage.setItem("ramadhan-pro-bookmarks", JSON.stringify(updatedBookmarks))

  return newBookmark
}

// Get all bookmarks
export const getBookmarks = (): Bookmark[] => {
  if (typeof window === "undefined") return []

  const bookmarksJson = localStorage.getItem("ramadhan-pro-bookmarks")
  if (!bookmarksJson) return []

  try {
    return JSON.parse(bookmarksJson)
  } catch (error) {
    console.error("Error parsing bookmarks:", error)
    return []
  }
}

// Remove a bookmark
export const removeBookmark = (id: string): boolean => {
  const bookmarks = getBookmarks()
  const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id)

  if (bookmarks.length === updatedBookmarks.length) {
    return false // Bookmark not found
  }

  localStorage.setItem("ramadhan-pro-bookmarks", JSON.stringify(updatedBookmarks))
  return true
}

// Check if an item is bookmarked
export const isBookmarked = (type: "surah" | "dua" | "ayah", reference: string): boolean => {
  const bookmarks = getBookmarks()
  return bookmarks.some((bookmark) => bookmark.type === type && bookmark.reference === reference)
}

